/* @flow */
const config = require('config')
const EventEmitter = require('events').EventEmitter
const Resque = require('node-resque').queue
const Logger = require('koop-logger')
const log = new Logger(config)
const Redis = require('ioredis')
const hash = require('object-hash')
const util = require('util')

const jobs = new Map()

function Queue (connection) {
  if (!connection) return
  this.q = new Resque(connection)
  this.connected = true
  this.q.on('error', e => log.error(e))
  initListener(new Redis(connection))
}

Queue.prototype.enqueue = function (type, options) {
  const job = new Job()
  jobs.set(job.id, job)
  options.id = job.id
  this.q.connect(() => this.q.enqueue('koop', type, options))
  return job
}

function initListener (redis) {
  redis.subscribe('jobs', () => {
    redis.on('message', (channel, message) => {
      handleMessage(message)
    })
  })
}

function handleMessage (message) {
  let info
  try {
    info = JSON.parse(message)
  } catch (e) {
    return log.error(e, message)
  }
  if (!info.status) return log.error(new Error('No status on job report'), message)
  const job = jobs.get(info.id)
  if (!job) return
  job.emit(info.status, info.data)
  if (job.status === 'finish' || job.status === 'fail') {
    jobs.delete(job.id)
  } else {
    job.status = info.status
    jobs.set(job.id, job)
  }
}

function Job (type, options) {
  this.id = hash.sha1({type, options})
  this.status = 'queued'
}

util.inherits(Job, EventEmitter)
