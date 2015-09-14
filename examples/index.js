'use strict';
const co = require('co');
const Client = require('..');
co(function*(argument) {
  let client = new Client({
    host: '192.168.2.1'
  });
  // let nodes = yield client.list('albi');
  // console.dir(nodes);

  // let nodes = yield client.listByTags('http-backend');
  // console.dir(nodes);

  // let result = yield client.checkRegister({
  //   id: '6e8fcc9cf398-http-ping',
  //   Name: 'HTTP ping',
  //   Notes: 'Ensure web server is health',
  //   HTTP: 'http://localhost:80/ping',
  //   TTL: '15s'
  // });

  // yield client.deregister('730d03591ba2');


  // yield client.register({
  //   id: 'de09347b12e6',
  //   service: 'albi',
  //   address: '172.17.0.11',
  //   port: 80,
  //   tags: ['http-backend', 'prefix:/albi', 'http-ping']
  // }, {
  //   Name: "web server health check",
  //   Notes: "http ping health check",
  //   Status: "passing"
  // });

  yield client.register({
    id: '6e8fcc9cf398',
    service: 'novel',
    address: '172.17.0.32',
    port: 80,
    tags: ['http-backend', 'prefix:/novel', 'http-ping']
  }, {
    Name: "web server health check",
    Notes: "http ping health check",
    Status: "passing"
  });

}).catch(function(err) {
  console.dir(err);
})
