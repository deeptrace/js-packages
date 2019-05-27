'use strict'

const { CommonError } = require('@deeptrace/commons')

class ConfigError extends CommonError {
  //
}

class PropertyValueBuildingError extends ConfigError {
  //
}

class PropertyValueCastingError extends PropertyValueBuildingError {
  //
}

class PropertyValueValidationError extends PropertyValueBuildingError {
  //
}

class ConfigValidationError extends ConfigError {
  /**
   * @param {PropertyValueBuildingError[]} errors
   */
  constructor (errors) {
    super("Ops! There's a few things wrong in your configuration")
    this.errors = errors
  }
}

module.exports.ConfigError = ConfigError
module.exports.PropertyValueBuildingError = PropertyValueBuildingError
module.exports.PropertyValueCastingError = PropertyValueCastingError
module.exports.PropertyValueValidationError = PropertyValueValidationError
module.exports.ConfigValidationError = ConfigValidationError
