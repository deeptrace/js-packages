'use strict'

/**
 * @module DeepTrace.JSTools.Commons
 */

module.exports = {
  BadRequestHttpError: require('./lib/BadRequestHttpError.js'),
  ConflictHttpError: require('./lib/ConflictHttpError.js'),
  DomainError: require('./lib/DomainError.js'),
  Error: require('./lib/Error.js'),
  ForbiddenHttpError: require('./lib/ForbiddenHttpError.js'),
  GoneHttpError: require('./lib/GoneHttpError.js'),
  HttpError: require('./lib/HttpError.js'),
  InfrastructureError: require('./lib/InfrastructureError.js'),
  InternalServerErrorHttpError: require('./lib/InternalServerErrorHttpError.js'),
  LockedHttpError: require('./lib/LockedHttpError.js'),
  NotFoundHttpError: require('./lib/NotFoundHttpError.js'),
  PaymentRequiredHttpError: require('./lib/PaymentRequiredHttpError.js'),
  ServerFaultHttpError: require('./lib/ServerFaultHttpError.js'),
  ServiceUnavailableHttpError: require('./lib/ServiceUnavailableHttpError.js'),
  TooManyRequestsHttpError: require('./lib/TooManyRequestsHttpError.js'),
  UnauthorizedHttpError: require('./lib/UnauthorizedHttpError.js'),
  UnprocessableEntityHttpError: require('./lib/UnprocessableEntityHttpError.js'),
  UserFaultHttpError: require('./lib/UserFaultHttpError.js')
}
