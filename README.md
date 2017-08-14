# Koop-Queue

[![Greenkeeper badge](https://badges.greenkeeper.io/koopjs/koop-queue.svg)](https://greenkeeper.io/)
*A queuing system for Koop*

[![npm][npm-img]][npm-url]
[![travis][travis-image]][travis-url]

## Installation
### As a package
`npm install koop-queue`

### From source
```bash
git clone https://github.com/koopjs/koop-queue.git
cd koop-queue
npm install
npm install -g babel-cli
npm run compile
```

## Usage
### As a Koop Plugin
```javascript
const Koop = require('koop')
const config = require('config')
const koop = Koop(config)
const Queue = require('koop-queue')

// koop will instantiate an instance of Queue
koop.register(Queue)
```

### Standalone
```javascript
const Queue = require('koop-queue')

const connection = {
  host: '127.0.0.1',
  port: 6379,
  prefix: 'koop-jobs'
}

const queue = new Queue()

const options = {
  table: '1ef:0',
  format: 'csv',
  key: 'J2E4QvGLBHgX',
  name: 'trees',
  path: './output'
}

// returns an event emitter
const job = queue.enqueue('xport', options)

job
.on('error', e => console.log(e))
.on('start', () => console.log('Job started'))
.on('progress', progress => console.log(progress))
.on('finish', () => console.log('Job finished'))
```

## Configuration
In config/:env.json

*Note: all connection configs are optional*

```json
{
  "queue": {
    "connection": {
      "host": "127.0.0.1",
      "port": 6379,
      "namespace": "koop-jobs",
      "database": 0
    }
  }
}
```
[npm-img]: https://img.shields.io/npm/v/koop-queue.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/koop-queue
[travis-image]: https://img.shields.io/travis/koopjs/koop-queue.svg?style=flat-square
[travis-url]: https://travis-ci.org/koopjs/koop-queue

