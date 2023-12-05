export const createPlaceholderImage = (): Promise<HTMLImageElement> => {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 64

  const ctx = canvas.getContext('2d')

  if (ctx === null) {
    throw new Error('No context!')
  }

  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#ddd'
  ctx.font = 'monospaced'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('No image', canvas.width * 0.5, canvas.height * 0.5)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) {
        reject(new Error('Blob is null'))
        return
      }
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.src = URL.createObjectURL(blob)
    })
  })
}

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  return new Promise((resolve, reject) => {
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () => reject(image))
    image.src = src
  })
}

export const cloneImage = (source: HTMLImageElement): Promise<HTMLImageElement> => {
  const canvas = document.createElement('canvas')
  canvas.width = source.width
  canvas.height = source.height

  const ctx = canvas.getContext('2d')!
  ctx.drawImage(source, 0, 0)

  const image = new Image()
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) {
        reject(new Error('Blob is null'))
        return
      }
      image.addEventListener('load', () => resolve(image))
      image.src = URL.createObjectURL(blob!)
    })
  })
}
