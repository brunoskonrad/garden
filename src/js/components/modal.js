import $ from 'jquery'
import emitter from '../utils/emitter'

const NAME = 'modal'

const templates = {
  modal: '<div class="modal"></div>',
  close: '<i class="modal-close glyph glyph-x"></i>',
  content: '<div class="modal-content"><div class="modal-body"></div></div>'
}

const DEFAULTS = {
  container: 'body',
  triggerClose: null
}

class Modal {
  constructor (element, options) {
    this.$element = (element instanceof $) ? element : $(element)
    this.options = $.extend({}, DEFAULTS, (options || {}))
  }

  init () {
    this.$container = $(this.options.container)
    this.createModal()

    return this
  }

  show () {
    this.bindListeners()
    this.showModal()
  }

  hide () {
    this.unbindListeners()
    this.hideModal()
  }

  destroy () {
    this.$element.removeData(NAME)
    this.$modal.remove()
  }

  bindListeners () {
    if (this.options.triggerClose) {
      this.$modal.on('click', this.options.triggerClose, this.hide.bind(this))
    }

    this.$close.on('click', this.hide.bind(this))

    $(window).on('keyup', this.handler = (e) => {
      if (e.which === 27) {
        this.hide()
      }
    })
  }

  unbindListeners () {
    if (this.options.triggerClose) {
      this.$modal.off('click', this.options.triggerClose, this.hide.bind(this))
    }

    this.$close.off('click')
    $(window).off('keyup', this.handler)
  }

  bindTrigger () {
    if (this.options.triggerOpen) {
      $(this.options.triggerOpen).on(
        'click',
        this.onTriggerOpenClick.bind(this)
      )
    }
  }

  onTriggerOpenClick (event) {
    event.preventDefault()
    this.show()
  }

  showModal () {
    emitter.emit('modal:show')

    this.$modal.addClass('modal-enter')
    this.$content.addClass('modal-content-enter')
    this.$container.addClass('no-scroll')

    window.setTimeout(() => {
      this.$modal.addClass('modal-show')
      this.$content.addClass('modal-content-show')
    }, 200)

    this.$modal.on('click', this.onModalClick.bind(this))
  }

  hideModal () {
    emitter.emit('modal:hide')

    this.$content
      .removeClass('modal-content-show')
      .addClass('modal-content-leave')

    this.$modal
      .removeClass('modal-show')
      .addClass('modal-leave')

    this.$container.removeClass('no-scroll')

    window.setTimeout(() => {
      this.$modal.removeClass('modal-enter modal-leave')
      this.$content.removeClass('modal-content-enter modal-content-leave')
    }, 200)
  }

  onModalClick (event) {
    if (this.$modal.is(event.target)) {
      this.hideModal()
    }
  }

  fillModal () {
    this.$content.find('.modal-body').append(this.$element.html())
  }

  createModal () {
    this.$modal = $(templates.modal)
    this.$content = $(templates.content)
    this.$close = $(templates.close)

    this.$content.append(this.$close)
    this.$modal.append(this.$content)

    this.$container.append(this.$modal)

    this.bindTrigger()
    this.fillModal()
  }
}

/* istanbul ignore next */
$.fn[NAME] = function (options) {
  options = options || {}

  return this.each(function () {
    if (!$.data(this, NAME)) {
      $.data(this, NAME, new Modal(this, options).init())
    }
  })
}

export default Modal
