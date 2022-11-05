export const createSinglePixelImage = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1

  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'rgba(0,0,0,0)'
  ctx.fillRect(0, 0, 1, 1)

  const img = document.createElement('img')
  img.src = canvas.toDataURL('image/png')
  return img
}

export const singlePixelImage = createSinglePixelImage()
