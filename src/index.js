/* @flow */
'use strict'
const config = require('config')
const connection = config.queue.connection
connection.pkg = 'redis'
const EventEmitter = require('events').EventEmitter
const Resque = require('node-resque').queue
const Scheduler = require('node-resque').scheduler
const Logger = require('koop-logger')
const log = new Logger(config)
const Redis = require('redis')
const hash = require('object-hash')
const util = require('util')

const jobs = new Map()

function Queue () {
  if (!connection) throw new Error('Redis connection missing from config')
  this.q = new Resque({connection})
  this.q.on('error', e => log.error(e))
  this.listener = initListener(connection)
  this.scheduler = initScheduler(connection)
  this.scheduler.on('error', e => log.error(e))
}

Queue.type = 'plugin'
Queue.plugin_name = 'queue'
Queue.dependencies = []
Queue.version = require('./package.json').version

Queue.prototype.enqueue = function (type, options) {
  const job = new Job(type, options)
  jobs.set(job.id, job)
  options.job_id = job.id
  if (!this.connected) {
    this.q.connect(() => {
      this.connected = true
      this.q.enqueue('koop', type, options)
    })
  } else {
    this.q.enqueue('koop', type, options)
  }
  return job
}

Queue.prototype.shutdown = function () {
  this.q.end()
  this.listener.quit()
  this.scheduler.end()
}

function initListener (connection) {
  const redis = Redis.createClient(connection)
  redis.subscribe('jobs', () => {
    redis.on('message', (channel, json) => {
      handleMessage(json)
    })
  })
  return redis
}

function initScheduler (connection) {
  const scheduler = new Scheduler({connection})
  scheduler.connect(() => scheduler.start())
  return scheduler
}

function handleMessage (json) {
  let message
  try {
    message = JSON.parse(json)
  } catch (e) {
    return log.error(e, json)
  }
  if (!message.status) return log.error(new Error('No status on job report'), message)
  const job = jobs.get(message.id)
  if (!job) return
  job.emit(message.status, message)
  if (job.status === 'finish' || job.status === 'fail') {
    jobs.delete(job.id)
  } else {
    job.status = message.status
    jobs.set(job.id, job)
  }
}

function Job (type, options) {
  this.id = hash.sha1({type, options})
  this.options = options
  this.status = 'queued'
}

util.inherits(Job, EventEmitter)

module.exports = Queue
