/* eslint-disable no-underscore-dangle */
import * as pcuiClass from './class'
import { Element } from './element'

interface Args {
  allowTextSelection?: boolean
  nativeTooltip?: boolean
  dom?: HTMLElement
  text?: string
  placeholder?: string
  renderChanges?: boolean
}

/**
 * @name Label
 * @class
 * @classdesc The Label is a simple span element that displays some text.
 * @property {string} placeholder Gets / sets the placeholder label that appears on the right of the label.
 * @property {string} text Gets / sets the text of the Label.
 * @augments Element
 * @mixes IBindable
 */
export class Label extends Element {
  /**
   * If true then the innerHTML property will be used to set the text. Otherwise textContent will be used instead.
   */
  unsafe = false

  /**
   * If true then the Label will flash when its text changes.
   */
  renderChanges = false

  #text = ''

  /**
   * Creates a new Label.
   *
   * @param args - Extends the pcui.Element constructor arguments. All settable properties can also be set through the constructor.
   * @param {boolean} [args.nativeTooltip] - If true then use the text of the label as the native HTML tooltip.
   * @param {boolean} [args.allowTextSelection] - If true then the label can be clicked to select text.
   */
  constructor (args: Args = {}) {
    args.dom ??= document.createElement('span')

    super(args)

    this.dom.classList.add('align-middle', 'whitespace-nowrap', 'pcui-label')

    this.text = args.text ?? ''

    if (args.allowTextSelection) {
      this.dom.classList.add(pcuiClass.DEFAULT_MOUSEDOWN)
    }

    if (args.nativeTooltip) {
      this.dom.title = this.text
    }
    this.placeholder = args.placeholder ?? null

    if (args.renderChanges) {
      this.renderChanges = args.renderChanges
    }

    this.on('change', () => {
      if (this.renderChanges) {
        this.flash()
      }
    })
  }

  _updateText (value: string) {
    this.dom.classList.remove(pcuiClass.MULTIPLE_VALUES)

    if (this.#text === value) {
      return false
    }

    this.#text = value

    if (this.unsafe) {
      this.dom.innerHTML = value
    } else {
      this.dom.textContent = value
    }

    this.emit('change', value)

    return true
  }

  set text (value: string | null | undefined) {
    const changed = this._updateText(value ?? '')

    if (changed && this._binding) {
      this._binding.setValue(value ?? '')
    }
  }

  get text () {
    return this.#text
  }

  set placeholder (value) {
    if (value) {
      this.dom.setAttribute('placeholder', value)
    } else {
      this.dom.removeAttribute('placeholder')
    }
  }

  get placeholder () {
    return this.dom.getAttribute('placeholder')
  }
}
