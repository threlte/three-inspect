/* eslint-disable no-underscore-dangle */
import * as pcuiClass from './class'
import { Element } from './element'

interface Args {
  value?: string
}

/**
 * The TextInput is an input element of type text.
 * @augments Element
 * @property {HTMLElement} input Gets the HTML input element.
 * If false then the input will be set in an error state and the value will not propagate to the binding.
 */
export class TextInput extends Element {
  /**
   * A function that validates the value that is entered into the input
   * and returns true if it is valid or false otherwise.
   */
  onValidate: null | ((value: string) => boolean) = null

  /**
   * If true then the TextInput will flash when its text changes.
   * @default false
   */
  renderChanges = false

  /**
   * Whether pressing Enter will blur (unfocus) the field.
   * @default true
   */
  blurOnEnter = true

  /**
   * Whether pressing Escape will blur (unfocus) the field.
   * @default true
   */
  blurOnEscape = true

  #keyChange = false
  #suspendInputChangeEvt = false
  #prevValue = ''

  /**
   * Creates a new TextInput.
   *
   * @param {object} args - Extends the pcui.Element constructor arguments. All settable properties can also be set through the constructor.
   */
  constructor (args: Args = {}) {
    super({
      dom: document.createElement('input'),
      ...args,
    })

    this.dom.classList.add('pcui-text-input', 'font-mono', 'text-[11px]')

    this.dom.ui = this
    this.dom.tabIndex = 0
    this.dom.autocomplete = 'off'

    this.dom.addEventListener('change', this._onInputChange)
    this.dom.addEventListener('focus', this._onInputFocus)
    this.dom.addEventListener('blur', this._onInputBlur)
    this.dom.addEventListener('keydown', this._onInputKeyDown)
    this.dom.addEventListener('contextmenu', this._onInputCtxMenu, false)

    if (args.value !== undefined) {
      this.value = args.value
    }

    this.on('change', () => {
      if (this.renderChanges) {
        this.flash()
      }
    })

    this.on('disable', this._updateInputReadOnly.bind(this))
    this.on('enable', this._updateInputReadOnly.bind(this))
    this.on('readOnly', this._updateInputReadOnly.bind(this))
    this._updateInputReadOnly()
  }

  _onInputChange = (evt: Event) => {
    if (this.#suspendInputChangeEvt) {
      return
    }

    if (this.onValidate) {
      const error = !this.onValidate(this.value)
      this.error = error
      if (error) {
        return
      }
    } else {
      this.error = false
    }

    this.emit('change', this.value)

    if (this._binding) {
      this._binding.setValue(this.value)
    }
  }

  _onInputFocus = (evt: FocusEvent) => {
    this.dom.classList.add(pcuiClass.FOCUS)
    this.emit('focus', evt)
    this.#prevValue = this.value
  }

  _onInputBlur = (evt: FocusEvent) => {
    this.dom.classList.remove(pcuiClass.FOCUS)
    this.emit('blur', evt)
  }

  _onInputKeyDown = (evt: KeyboardEvent) => {
    const lowerKey = evt.key.toLowerCase()
    if (lowerKey === 'enter' && this.blurOnEnter) {
      /*
       * Do not fire input change event on blur
       * if keyChange is true (because a change event)
       * will have already been fired before for the current
       * value
       */
      this.#suspendInputChangeEvt = this.keyChange
      this.dom.blur()
      this.#suspendInputChangeEvt = false
    } else if (lowerKey === 'escape') {
      this.#suspendInputChangeEvt = true
      const prev = this.dom.value
      this.dom.value = this.#prevValue
      this.#suspendInputChangeEvt = false

      // Manually fire change event
      if (this.keyChange && prev !== this.#prevValue) {
        this._onInputChange(evt)
      }

      if (this.blurOnEscape) {
        this.dom.blur()
      }
    }

    this.emit('keydown', evt)
  }

  _onInputKeyUp = (evt: KeyboardEvent) => {
    if (evt.keyCode !== 27) {
      this._onInputChange(evt)
    }

    this.emit('keyup', evt)
  }

  _onInputCtxMenu = (evt: Event) => {
    this.dom.select()
  }

  _updateInputReadOnly () {
    const readOnly = !this.enabled || this.readOnly
    if (readOnly) {
      this.dom.setAttribute('readonly', 'readonly')
    } else {
      this.dom.removeAttribute('readonly')
    }
  }

  _updateValue (value: string | null | undefined) {
    this.dom.classList.remove(pcuiClass.MULTIPLE_VALUES)

    if (value === this.value) {
      return false
    }

    this.#suspendInputChangeEvt = true
    this.dom.value = value ?? ''
    this.#suspendInputChangeEvt = false

    this.emit('change', value)

    return true
  }

  /**
   * @name TextInput#focus
   * @description Focuses the Element.
   * @param {boolean} select - If true then this will also select the text after focusing.
   */
  focus (select: boolean) {
    this.dom.focus()
    if (select) {
      this.dom.select()
    }
  }

  /**
   * @name TextInput#blur
   * @description Blurs (unfocuses) the Element.
   */
  blur () {
    this.dom.blur()
  }

  override destroy () {
    if (this.destroyed) {
      return
    }
    this.dom.removeEventListener('change', this._onInputChange)
    this.dom.removeEventListener('focus', this._onInputFocus)
    this.dom.removeEventListener('blur', this._onInputBlur)
    this.dom.removeEventListener('keydown', this._onInputKeyDown)
    this.dom.removeEventListener('keyup', this._onInputKeyUp)
    this.dom.removeEventListener('contextmenu', this._onInputCtxMenu)
    super.destroy()
    this.dom = null
  }

  set value (value: string) {
    const changed = this._updateValue(value)

    if (changed) {
      // Reset error
      this.error = false
    }

    if (changed && this._binding) {
      this._binding.setValue(value)
    }
  }

  get value () {
    return this.dom.value
  }

  /**
   * The placeholder label that appears on the right of the input.
   */
  set placeholder (value: string | null) {
    if (value === null) {
      this.dom.removeAttribute('placeholder')
    } else {
      this.dom.setAttribute('placeholder', value)
    }
  }

  get placeholder () {
    return this.dom.getAttribute('placeholder')
  }

  /**
   * Whether any key up event will cause a change event to be fired.
   */
  set keyChange (value) {
    if (this.#keyChange === value) {
      return
    }

    this.#keyChange = value
    if (value) {
      this.dom.addEventListener('keyup', this._onInputKeyUp)
    } else {
      this.dom.removeEventListener('keyup', this._onInputKeyUp)
    }
  }

  get keyChange () {
    return this.#keyChange
  }

  get input () {
    return this.dom
  }
}
