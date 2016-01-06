const config = require('config')
const connection = config.connection
const Worker = require('node-resque').worker
const Redis = require('ioredis')
const redis = new Redis(connection)

const jobs = {
  succeed: {
    perform: succeed
  },
  fail: {
    perform: fail
  }
}

const queues = ['koop']
const worker = new Worker({connection, queues}, jobs)
worker.connect(() => worker.start())
worker.on('end', () => redis.end())

function fail (job, done) {
  redis.publish('jobs', JSON.stringify({id: job.job_id, status: 'fail'}))
  done()
}

function succeed (job, done) {
  redis.publish('jobs', JSON.stringify({id: job.job_id, status: 'start'}))
  redis.publish('jobs', JSON.stringify({id: job.job_id, status: 'progress'}))
  redis.publish('jobs', JSON.stringify({id: job.job_id, status: 'finish'}))
  done()
}

module.exports = worker
