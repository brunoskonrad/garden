import $ from 'jquery';

const NAME      = 'form';
const DEFAULTS  = {
  events: 'change',
  selectors: '.input, select, .select, .textarea'
};

class Form {
  constructor(element, options) {
    this._element = $(element);
    this._options = $.extend({}, DEFAULTS, (options || {}));

    this.bindListeners();

    this.toggleFieldsActiveClass();
  }

  bindListeners() {
    $(document).on(
      this._options.events, this._options.selectors,
      this.onFieldChange.bind(this)
    );
  }

  onFieldChange(event) {
    this.toggleActiveClass(event.target);
  }

  shouldInputBeActive(input) {
    return !!(input.value || input.placeholder);
  }

  toggleActiveClass(input) {
    let $input = $(input),
      $field = $input.parents('.field');

    if(!$field.length) {
      return;
    }

    if (!$field.hasClass('active') && this.shouldInputBeActive(input)) {
      return $field.addClass('active');
    }

    if ($field.hasClass('active') && !this.shouldInputBeActive(input)) {
      return $field.removeClass('active');
    }
  }

  toggleFieldsActiveClass() {
    Array.prototype.forEach.call(
      this._element.find(this._options.selectors),
      this.toggleActiveClass.bind(this)
    );
  }
}

/* istanbul ignore next */
$.fn[NAME] = function(options) {
  options = options || {};

  return this.each(function() {
    if (!$.data(this, NAME)) {
      $.data(this, NAME, new Form(this, options));
    }
  });
};

export default Form;
