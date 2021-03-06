import $ from 'jquery'

import emitter from '../utils/emitter'

import rules from './validation/defaults'

const NAME = 'validation'
const DEFAULTS = {
  events: 'blur',
  selector: '[data-required]'
}

class Validation {
  constructor (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, DEFAULTS, (options || {}))
  }

  init () {
    this._fields = this.$element.find(this.options.selector)

    this.bindListeners()

    return this
  }

  bindListeners () {
    this.handler = (e) => {
      this.validate(e.target)
    }

    this.$element.off(this.options.events, this.options.selector, this.handler)
    this.$element.on(this.options.events, this.options.selector, this.handler)
  }

  setPristine (field) {
    emitter.emit('validation:pristine', field)
  }

  validate (field) {
    let rules = field.getAttribute('data-validate')

    if (!rules) {
      return
    }

    rules = rules.split(' ').reduce((errors, rule) => {
      if (!this.rules[rule].call(this, field, this.$element)) {
        errors.push(rule)
      }

      return errors
    }, [])

    emitter.emit(`validation:${!rules.length ? 'success' : 'error'}`, field, rules)

    return !rules.length
  }

  validateAll () {
    return Array.prototype.map.call(this.$element.find(this.options.selector), this.validate, this)
      .every(validation => validation)
  }
}

Validation.prototype.rules = rules

/* istanbul ignore next */
$.fn[NAME] = function (options) {
  options = options || {}

  return this.each(function () {
    if (!$.data(this, NAME)) {
      $.data(this, NAME, new Validation(this, options).init())
    }
  })
}

export default Validation
