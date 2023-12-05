import { type View, ViewProps, ClassName as cName } from '@tweakpane/core'

interface Config {
  viewProps: ViewProps
  imageFit: 'contain' | 'cover'
  extensions: string[]
}

const cn = cName('img')

export class PluginView implements View {
  public readonly element: HTMLElement
  public readonly input: HTMLElement
  private image: HTMLImageElement

  constructor (doc: Document, config: Config) {
    this.element = doc.createElement('div')
    this.element.classList.add(cn())
    config.viewProps.bindClassModifiers(this.element)

    this.input = doc.createElement('input')
    this.input.classList.add(cn('input'))
    this.input.setAttribute('type', 'file')
    this.input.setAttribute('accept', config.extensions.join(','))
    this.element.append(this.input)

    this.image = doc.createElement('img')
    this.image.classList.add(cn('image'))
    this.image.classList.add(cn(`image_${config.imageFit}`))

    this.element.classList.add(cn('area_root'))

    this.element.append(this.image)
  }

  changeImage (src: string) {
    this.image.src = src
  }

  changeDraggingState (state: boolean) {
    const el = this.element
    if (state) {
      el.classList.add(cn('area_dragging'))
    } else {
      el.classList.remove(cn('area_dragging'))
    }
  }
}
