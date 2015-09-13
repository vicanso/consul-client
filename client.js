'use strict';
const request = require('superagent');
const co = require('co');

class Client {

  // 构造函数
  /**
   * [constructor description]
   * @param  {[type]} host [description]
   * @param  {[type]} port [description]
   * @param  {[type]} dc   [description]
   * @return {[type]}      [description]
   */
  constructor(host, port, dc) {
    this.host = host || '127.0.0.1';
    this.port = port || 8500;
    this.dc = dc;
  }

  /**
   * [register 注册consul服务]
   * @param {String} node 服务节点
   * @param {String} service 服务名称
   * @param {String} address 服务地址
   * @param {Number} port 服务端口
   * @param {Array} tags 服务tags
   */
  * register(node, service, address, port, tags) {
    let data = {
      Node: node,
      Address: address,
      Service: {
        ID: node,
        Service: service,
        Port: port,
        Address: address,
        tags: tags
      }
    };
    if (this.dc) {
      data.Datacenter = this.dc;
    }
    let url = 'http://' + this.host + ':' + this.port +
      '/v1/catalog/register';
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
    let url = 'http://' + this.host + ':' + this.port +
      '/v1/catalog/deregister';
    yield put(url, data);
  }
}


/**
 * [put description]
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
function* put(url, data) {

  return yield new Promise(function(resolve, reject) {
    request.put(url).send(data).end(function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

module.exports = Client;
