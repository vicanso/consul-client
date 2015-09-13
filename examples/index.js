'use strict';
const co = require('co');
const Client = require('..');
co(function*(argument) {
  let client = new Client();
  // yield client.deregister('ABCDEFG');
  // yield client.register('ABCDEFG', 'TEST-APP', '192.168.1.1', 80, [
  //   'http-backend', 'http-ping'
  // ]);
}).catch(function(err) {
  console.dir(err);
})
