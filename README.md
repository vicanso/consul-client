simple consul clinet

## constructor
### 构建函数

```js
let client = new Client({
  host: '127.0.0.1',
  port: 8500
});
```

## register
### 注册服务

```js
yield client.register({
  id: '730d03591ba2',
  service: 'albi',
  address: '172.17.0.1',
  port: 80,
  tags: ['http-backend', 'prefix:/albi', 'http-ping']
});
```

## deregister
### 注销服务

```js
yield client.deregister('730d03591ba2');
```


## list
### 列出某服务的所有节点信息

```js
yield client.list('albi');
```

## listByTags
### 列出包含某种tag的节点信息

```js
yield client.listByTags(['http-ping']);
```
