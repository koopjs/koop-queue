# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.2.0] - 2016-11-29
### Added
* Delayed job option

## [0.1.2] - 2016-09-26
### Fixed
* No longer throwing exception when shutting down before a job has run
* Fixed memory leak where jobs were never deleted from the jobs map

## [0.1.1] - 2016-04-24
### Changed
* Replace ioredis with node-redis

## [0.1.0] - 2016-03-16
### Added
* Added scheduler for delayed jobs

## [0.0.3] - 2016-03-16
### Changed
* Update Node-Resque to 2.0.1

## [0.0.2] - 2016-01-07
### Changed
* Works as a Koop-3.0 Plugin
* `queue` object is exported

### Fixed
* Jobs are not added until the queue is connected
* JSON parsing is handled in try/catch

## [0.0.1] - 2015-12-30
### Added
* A new queuing system for Koop with one exposed method `enqueue`

[0.2.0]: https://www.github.com/koopjs/koop-queue/compare/v0.1.2...v0.2.0
[0.1.2]: https://www.github.com/koopjs/koop-queue/compare/v0.1.1...v0.1.2
[0.1.1]: https://www.github.com/koopjs/koop-queue/compare/v0.1.0...v0.1.1
[0.1.0]: https://www.github.com/koopjs/koop-queue/compare/v0.0.3...v0.1.0
[0.0.3]: https://www.github.com/koopjs/koop-queue/compare/v0.0.2...v0.0.3
[0.0.2]: https://www.github.com/koopjs/koop-queue/compare/v0.0.1...v0.0.2
[0.0.1]: https://www.github.com/koopjs/koop-queue/tree/v0.0.1
