/* @flow */
const test = require('tape')
const Queue = require('../src/index.js')

const queue = new Queue()

const worker = require('./worker')

test('Receive all expected events from a successful job', t => {
  t.plan(9)
  const job = queue.enqueue('succeed', {id: 'succeed'})
  job
  .on('start', j => {
    t.equal(j.status, 'start', 'Correct status')
    t.equal(job.id, j.id, 'ID passed')
    t.pass('Start event handled')
  })
  .on('progress', j => {
    t.equal(j.status, 'progress', 'Correct status')
    t.equal(job.id, j.id, 'ID passed')
    t.pass('Progress event handled')
  })
  .on('finish', j => {
    t.equal(j.status, 'finish', 'Correct status')
    t.equal(job.id, j.id, 'ID passed')
    t.pass('Finish event handled')
  })
})

test('Receive expected events from a failed job', t => {
  t.plan(3)
  const job = queue.enqueue('fail', {id: 'fail'})
  job
  .on('fail', j => {
    t.equal(j.status, 'fail', 'Correct status')
    t.equal(job.id, j.id, 'ID passed')
    t.pass('Fail event handled')
  })
})

test('Teardown', t => {
  worker.end()
  queue.shutdown()
  t.end()
})
