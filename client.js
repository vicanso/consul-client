'use strict';
const request = require('superagent');
const _ = require('lodash');
const debug = require('debug')('jt.consul');
const parallel = require('co-parallel');
class Client {

  /**
   * [constructor description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  constructor(options) {
    options = options || {};
    this.host = options.host || '127.0.0.1';
    this.port = options.port || 8500;
    this.dc = options.dc;
  }

  /**
   * [register 注册consul服务]
   * @param  {[type]} options [description]
   * @param  {[type]} checkOptions
   * @return {[type]}         [description]
   */
  * register(options, checkOptions) {
    let tags = options.tags || [];
    tags.push('createdAt:' + Date.now());
    let data = {
      Node: options.id,
      Address: options.address,
      Service: {
        ID: options.id,
        Service: options.service,
        Port: options.port,
        Address: options.address,
        tags: tags
      }
    };
    if (this.dc) {
      data.Datacenter = this.dc;
    }
    if (checkOptions) {
      data.Check = checkOptions;
    }
    let url = this.url('register');
    debug('register %s, data:%j', url, data);
    yield put(url, data);
  }

  /**
   * [deregister 注销consul服务]
   * @param {String} node 服务节点
   */
  * deregister(node) {
    let data = {
      Node: node
    };
    if (this.dc) {
      data.Datacenter = this.dc;
    }
    let url = this.url('deregister');
    debug('deregister %s, data:%j', url, data);
    yield put(url, data);
  }


  /**
   * [list 列出该服务的所有节点信息]
   * @param {String} node 服务节点
   * @return {[type]}     [description]
   */
  * list(serviceName) {
    let url = this.url('service', serviceName);
    let res = yield get(url);
    return _.map(res.body, function(item) {
      let tmp = {
        name: item.ServiceName,
        ip: item.ServiceAddress,
        port: item.ServicePort,
        id: item.ServiceID,
        tags: item.ServiceTags
      };
      _.forEach(item.ServiceTags, function(tag) {
        let index = tag.indexOf(':');
        if (index !== -1) {
          let key = tag.substring(0, index);
          let value = tag.substring(index + 1);
          if (!tmp[key]) {
            tmp[key] = value;
          }
        }
      });
      return tmp;
    });
  }

  /**
   * [listByTags 根据tags，列出所有节点信息]
   * @param {String, Array} tags
   * @return {[type]}     [description]
   */
  * listByTags(tags) {
    if (!_.isArray(tags)) {
      tags = [tags];
    }
    let url = this.url('services');
    let res = yield get(url);
    let services = [];
    _.forEach(res.body, function(serviceTags, name) {
      _.forEach(tags, function(tag) {
        if (_.indexOf(serviceTags, tag) !== -1) {
          services.push(name);
        }
      });
    });
    services = _.uniq(services);
    let fns = services.map(this.list.bind(this));
    let result = yield parallel(fns);
    result = _.flattenDeep(result);
    result = _.sortBy(result, function(backend) {
      return backend.name;
    });
    return result;
  }

  // * checkRegister(data) {
  //   let url = this.url('checkRegister');
  //   let res = yield put(url, data);
  //   console.dir(res)
  // }
  //
  // * checkDeregister(checkId) {
  //   let url = this.url('checkDeregister', checkId);
  //   let res = yield get(url);
  //   console.dir(res);
  // }

  /**
   * [url 根据类型返回url]
   * @param  {[type]} type [description]
   * @param  {[type]} type [description]
   * @return {[type]}      [description]
   */
  url(type, name) {
    let url = 'http://' + this.host + ':' + this.port;
    switch (type) {
      case 'register':
        url += '/v1/catalog/register';
        break;
      case 'deregister':
        url += '/v1/catalog/deregister';
        break;
      case 'service':
        url += '/v1/catalog/service/' + name;
        break;
      case 'services':
        url += '/v1/catalog/services';
        break;
      case 'checkRegister':
        url += '/v1/agent/check/register';
        break;
      case 'checkDeregister':
        url += '/v1/agent/check/deregister/' + name;
        break;
      default:
        throw new Error('Not support default value');
    }
    return url;
  }
}


/**
 * [put description]
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
function put(url, data) {
  return new Promise(function(resolve, reject) {
    request.put(url).send(data).end(function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}


/**
 * [get description]
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function get(url) {
  return new Promise(function(resolve, reject) {
    request.get(url).end(function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

module.exports = Client;
