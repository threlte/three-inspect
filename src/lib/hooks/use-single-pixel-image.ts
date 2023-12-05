let img: HTMLImageElement | undefined

const initialize = () => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-binary-expression
  if (typeof document === undefined) {
    return
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 1
  canvas.height = 1

  if (ctx === null) {
    return
  }

  ctx.fillStyle = 'rgba(0,0,0,0)'
  ctx.fillRect(0, 0, 1, 1)

  img = document.createElement('img')
  img.src = canvas.toDataURL('image/png')
}

export const useSinglePixelImage = () => {
  return img ?? initialize()
}
