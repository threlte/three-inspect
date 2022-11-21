import type { OrbitControls } from '../lib/orbit-controls'
import { refs } from '../refs'

interface Axis {
  axis: 'x' | 'y' | 'z' | '-x' | '-y' | '-z'
  color: string[]
  direction: THREE.Vector3
  label?: 'X' | 'Y' | 'Z'
  line?: number
  position: THREE.Vector3
  size: number
}

export const createOrbitControlsGizmo = (container: HTMLElement, orbitControls: OrbitControls) => {
  const { camera } = refs
  const { Matrix4, Vector2, Vector3 } = refs.THREE

  const vec3 = new Vector3()
  const dpr = window.devicePixelRatio
  const unscaledSize = 80
  const size = unscaledSize * dpr
  const primarySize = 8 * dpr
  const secondarySize = 6 * dpr
  const padding = 8 * dpr
  const line = 2 * dpr

  // Internals
  const invRotMat = new Matrix4()
  const mouse = new Vector3()
  const rotateStart = new Vector2()
  const rotateEnd = new Vector2()
  const rotateDelta = new Vector2()
  const center = new Vector3(size / 2, size / 2, 0)

  // Generate list of axes
  const colors = {
    x: ['#f73c3c', '#942424'],
    y: ['#6ccb26', '#417a17'],
    z: ['#178cf0', '#0e5490'],
  }

  const axes: Axis[] = [
    { axis: 'x', color: colors.x, direction: new Vector3(1, 0, 0), label: 'X', line, position: new Vector3(), size: primarySize },
    { axis: 'y', color: colors.y, direction: new Vector3(0, 1, 0), label: 'Y', line, position: new Vector3(), size: primarySize },
    { axis: 'z', color: colors.z, direction: new Vector3(0, 0, 1), label: 'Z', line, position: new Vector3(), size: primarySize },
    { axis: '-x', color: colors.x, direction: new Vector3(-1, 0, 0), position: new Vector3(), size: secondarySize },
    { axis: '-y', color: colors.y, direction: new Vector3(0, -1, 0), position: new Vector3(), size: secondarySize },
    { axis: '-z', color: colors.z, direction: new Vector3(0, 0, -1), position: new Vector3(), size: secondarySize },
  ]

  let selectedAxis: Axis | null = null
  let isDragging = false
  let rect: DOMRect
  let orbitState = false

  const canvas = document.createElement('canvas')
  canvas.style.width = `${size / 2}px`
  canvas.style.height = `${size / 2}px`
  canvas.width = size
  canvas.height = size
  canvas.className = 'orbit-controls-gizmo'
  container.append(canvas)

  const context = canvas.getContext('2d')!

  const drawCircle = (point: THREE.Vector3, radius = 10, color = '#FF0000') => {
    context.beginPath()
    context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false)
    context.fillStyle = color
    context.fill()
    context.closePath()
  }

  const drawLine = (point1: THREE.Vector3, point2: THREE.Vector3, width = 1, color = '#FF0000') => {
    context.beginPath()
    context.moveTo(point1.x, point1.y)
    context.lineTo(point2.x, point2.y)
    context.lineWidth = width
    context.strokeStyle = color
    context.stroke()
    context.closePath()
  }

  const drawLayers = (clear: boolean) => {
    if (clear) {
      context.clearRect(0, 0, canvas.width, canvas.height)
    }

    // For each layer, draw the axis
    for (let i = 0, length = axes.length; i < length; i += 1) {
      const axis = axes[i]

      // Set the color
      const highlight = selectedAxis === axis
      const color = (axis.position.z >= -0.01)
        ? axis.color[0]
        : axis.color[1]

      // Draw the line that connects it to the center if enabled
      if (axis.line) {
        drawLine(center, axis.position, axis.line, color)
      }

      // Draw the circle for the axis
      drawCircle(axis.position, axis.size, highlight ? '#FFFFFF' : color)

      // Write the axis label (X,Y,Z) if provided
      if (axis.label) {
        context.font = `bold ${12 * dpr}px monospace`
        context.fillStyle = '#222222'
        context.textBaseline = 'middle'
        context.textAlign = 'center'
        context.fillText(axis.label, axis.position.x, axis.position.y)
      }
    }
  }

  const setAxisPosition = (axis: Axis) => {
    const position = axis.direction.clone().applyMatrix4(invRotMat)
    axis.position.set(
      (position.x * (center.x - (axis.size / 2) - padding)) + center.x,
      center.y - (position.y * (center.y - (axis.size / 2) - padding)),
      position.z
    )
  }

  const update = () => {
    camera.updateMatrix()
    invRotMat.extractRotation(camera.matrix).invert()

    for (let i = 0, length = axes.length; i < length; i += 1) {
      setAxisPosition(axes[i])
    }

    // Sort the layers where the +Z position is last so its drawn on top of anything below it
    axes.sort((a, b) => ((a.position.z > b.position.z) ? 1 : -1))

    // Draw the layers
    drawLayers(true)
  }

  const onDrag = (e: PointerEvent) => {
    if (!isDragging) {
      canvas.classList.add('dragging')
    }

    isDragging = true

    selectedAxis = null

    rotateEnd.set(e.clientX, e.clientY)

    rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(0.5)

    rotateStart.copy(rotateEnd)

    orbitControls.update()
  }

  const onPointerUp = () => {
    setTimeout(() => {
      isDragging = false
    }, 0)
    canvas.classList.remove('dragging')
    orbitControls.enabled = orbitState
    window.removeEventListener('pointermove', onDrag, false)
    window.removeEventListener('pointerup', onPointerUp, false)
  }

  const onPointerEnter = () => {
    rect = canvas.getBoundingClientRect()
  }

  const onPointerMove = (e?: PointerEvent) => {
    if (isDragging) {
      return
    }

    const currentAxis = selectedAxis

    selectedAxis = null
    if (e !== undefined) {
      mouse.set(e.clientX - rect.left, e.clientY - rect.top, 0)
    }

    // Loop through each layer
    for (let i = 0, length = axes.length; i < length; i += 1) {
      vec3.copy(axes[i].position).divideScalar(dpr)
      const distance = mouse.distanceTo(vec3)

      if (distance < axes[i].size) {
        selectedAxis = axes[i]
      }
    }

    if (currentAxis !== selectedAxis) {
      drawLayers(false)
    }
  }

  const onPointerDown = (e: PointerEvent) => {
    rotateStart.set(e.clientX, e.clientY)
    orbitState = orbitControls.enabled
    orbitControls.enabled = false
    window.addEventListener('pointermove', onDrag, false)
    window.addEventListener('pointerup', onPointerUp, false)
  }

  const onMouseClick = () => {
    if (isDragging || !selectedAxis) {
      return
    }

    const vec = selectedAxis.direction.clone()
    const distance = camera.position.distanceTo(orbitControls.target)
    vec.multiplyScalar(distance)

    const duration = 400
    const start = performance.now()
    const maxAlpha = 1
    const loop = () => {
      const now = performance.now()
      const delta = now - start
      const alpha = Math.min(delta / duration, maxAlpha)
      camera.position.lerp(vec, alpha)
      orbitControls.update()

      if (alpha !== maxAlpha) {
        requestAnimationFrame(loop)
        return
      }

      onPointerMove()
    }

    loop()

    selectedAxis = null
  }

  orbitControls.addEventListener('change', update)
  orbitControls.addEventListener('start', () => canvas.classList.add('inactive'))
  orbitControls.addEventListener('end', () => canvas.classList.remove('inactive'))

  canvas.addEventListener('pointerdown', onPointerDown, false)
  canvas.addEventListener('pointerenter', onPointerEnter, false)
  canvas.addEventListener('pointermove', onPointerMove, false)
  canvas.addEventListener('click', onMouseClick, false)

  update()

  return () => {
    orbitControls.removeEventListener('change', update)
    orbitControls.removeEventListener('start', () => canvas.classList.add('inactive'))
    orbitControls.removeEventListener('end', () => canvas.classList.remove('inactive'))

    canvas.removeEventListener('pointerdown', onPointerDown, false)
    canvas.removeEventListener('pointerenter', onPointerEnter, false)
    canvas.removeEventListener('pointermove', onPointerMove, false)
    canvas.removeEventListener('click', onMouseClick, false)
    window.removeEventListener('pointermove', onDrag, false)
    window.removeEventListener('pointerup', onPointerUp, false)

    canvas.remove()
  }
}
