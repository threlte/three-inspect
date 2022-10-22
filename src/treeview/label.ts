/* eslint-disable no-underscore-dangle */
import * as pcuiClass from './class'
import { Element } from './element'

interface Args {
  /**
   * If true then the label can be clicked to select text.
   */
  allowTextSelection?: boolean
  dom?: HTMLElement
  text?: string
  renderChanges?: boolean
}

/**
 * The Label is a simple span element that displays some text.
 */
export class Label extends Element {
  /**
   * If true then the Label will flash when its text changes.
   */
  renderChanges = false

  #text = ''

  /**
   * Creates a new Label.
   */
  constructor (args: Args = {}) {
    args.dom ??= document.createElement('span')

    super(args)

    this.dom.classList.add('align-middle', 'whitespace-nowrap', 'pcui-label')

    this.text = args.text ?? ''

    if (args.allowTextSelection) {
      this.dom.classList.add(pcuiClass.DEFAULT_MOUSEDOWN)
    }

    if (args.renderChanges) {
      this.renderChanges = args.renderChanges
    }

    this.on('change', () => {
      if (this.renderChanges) {
        this.flash()
      }
    })
  }

  #updateText (value: string) {
    if (this.#text === value) {
      return false
    }

    this.#text = value
    this.dom.textContent = value
    this.emit('change', value)

    return true
  }

  /**
   * The text of the Label.
   */
  set text (value: string) {
    this.#updateText(value)
  }

  get text (): string {
    return this.#text
  }
}
