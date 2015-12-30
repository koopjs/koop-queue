# Koop-Queue
*A queuing system for Koop*

:construction: CAUTION WORK IN PROGRESS :construction:

## Usage
```javascript
const Queue = require('koop-queue')

const connection = {
  host: '127.0.0.1',
  port: 6379,
  prefix: 'koop-jobs'
}

const queue = new Queue(connection)

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
