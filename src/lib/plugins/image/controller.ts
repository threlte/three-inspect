import type { Controller, Value, ViewProps } from '@tweakpane/core'
import { cloneImage, createPlaceholderImage, loadImage } from './utils'
import type { ImageResolvable } from './model'
import { PluginView } from './view'

interface Config {
  value: Value<ImageResolvable>;
  imageFit: 'contain' | 'cover';
  extensions: string[];
  viewProps: ViewProps;
}

export class PluginController implements Controller<PluginView> {
  public readonly value: Value<ImageResolvable>
  public readonly view: PluginView
  public readonly viewProps: ViewProps
  private placeholderImage: HTMLImageElement | null = null

  constructor (doc: Document, config: Config) {
    this.value = config.value
    this.viewProps = config.viewProps

    this.view = new PluginView(doc, {
      viewProps: this.viewProps,
      extensions: config.extensions,
      imageFit: config.imageFit,
    })

    this.view.input.addEventListener('change', this.onFile)
    this.view.element.addEventListener('drop', this.onDrop)
    this.view.element.addEventListener('dragover', this.onDragOver)
    this.view.element.addEventListener('dragleave', this.onDragLeave)

    this.viewProps.handleDispose(() => {
      this.view.input.removeEventListener('change', this.onFile)
      this.view.input.removeEventListener('drop', this.onDrop)
      this.view.input.removeEventListener('dragover', this.onDragOver)
      this.view.input.removeEventListener('dragleave', this.onDragLeave)
    })

    this.value.emitter.on('change', this.handleValueChange)

    this.handleValueChange()
  }

  private onFile = (event: Event): void => {
    const { files } = event.target as HTMLInputElement
    if (files === null || files.length === 0) {
      return
    }

    const url = URL.createObjectURL(files[0])
    this.setValue(url)
    this.updateImage(url)
  }

  private onDrop = (event: DragEvent) => {
    event.preventDefault()
    try {
      const { dataTransfer } = event
      const file = dataTransfer?.files[0]
      if (file) {
        const url = URL.createObjectURL(file)
        this.updateImage(url)
        this.setValue(url)
      } else {
        const url = dataTransfer?.getData('url')
        if (!url) {
          throw new Error('No url')
        }
        loadImage(url).then(async (image) => {
          const clone = await cloneImage(image)
          this.updateImage(clone.src)
          this.setValue(clone)
        })
      }
    } catch (error) {
      console.error('Could not parse the dropped image', error)
    } finally {
      this.view.changeDraggingState(false)
    }
  }

  private onDragOver = (event: Event) => {
    event.preventDefault()
    this.view.changeDraggingState(true)
  }

  private onDragLeave = () => {
    this.view.changeDraggingState(false)
  }

  private async handleImage (image: ImageResolvable) {
    if (image instanceof HTMLImageElement) {
      const clone = await cloneImage(image)
      this.updateImage(clone.src)
    } else if (typeof image === 'string') {
      let finalUrl = ''
      try {
        if (image === 'placeholder') {
          throw new Error('placeholder')
        }
        const url = new URL(image)
        const loadedImage = await loadImage(image)
        finalUrl = loadedImage.src
      } catch {
        const img = await this.handlePlaceholderImage()
        finalUrl = img.src
      } finally {
        this.updateImage(finalUrl)
        this.setValue(finalUrl)
      }
    }
  }

  private updateImage (src: string) {
    this.view.changeImage(src)
  }

  private async setValue (src: ImageResolvable) {
    if (src instanceof HTMLImageElement) {
      this.value.setRawValue(src)
    } else if (src) {
      this.value.setRawValue(await loadImage(src))
    } else {
      this.value.setRawValue(await this.handlePlaceholderImage())
    }
  }

  private handleValueChange = () => {
    this.handleImage(this.value.rawValue)
  }

  private async handlePlaceholderImage (): Promise<HTMLImageElement> {
    this.placeholderImage ??= await createPlaceholderImage()
    return this.placeholderImage
  }
}
