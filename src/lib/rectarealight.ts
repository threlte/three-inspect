import * as THREE from 'three'

const positions = [
  +1, +1, 0,
  -1, +1, 0,
  -1, -1, 0,
  +1, -1, 0,
  +1, +1, 0,
]

const positions2 = [
  +1, +1, 0,
  -1, +1, 0,
  -1, -1, 0,
  +1, +1, 0,
  -1, -1, 0,
  +1, -1, 0,
]

export const createRectAreaLightHelper = (light: THREE.RectAreaLight, color?: THREE.Color) => {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.computeBoundingSphere()

  const material = new THREE.LineBasicMaterial({ fog: false })
  const line = new THREE.Line()

  // @ts-expect-error This is ok :P
  line.type = 'RectAreaLightHelper'

  const geometry2 = new THREE.BufferGeometry()
  geometry2.setAttribute('position', new THREE.Float32BufferAttribute(positions2, 3))
  geometry2.computeBoundingSphere()

  line.add(new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial({
    fog: false,
    side: THREE.BackSide,
  })))

  line.updateMatrixWorld = () => {
    line.scale.set(0.5 * light.width, 0.5 * light.height, 1)

    if (color === undefined) {
      material.color.copy(light.color).multiplyScalar(light.intensity)

      // Prevent hue shift
      const { color: matColor } = material
      const max = Math.max(matColor.r, matColor.g, matColor.b)
      if (max > 1) {
        matColor.multiplyScalar(1 / max)
      }

      const child = line.children[0] as THREE.Mesh
      const mat = child.material as THREE.MeshBasicMaterial
      mat.color.copy(matColor)
    } else {
      material.color.set(color)

      const child = line.children[0] as THREE.Mesh
      const mat = child.material as THREE.MeshBasicMaterial
      mat.color.set(color)
    }

    // Ignore world scale on light
    line.matrixWorld.extractRotation(light.matrixWorld).scale(line.scale)
      .copyPosition(light.matrixWorld)

    line.children[0].matrixWorld.copy(line.matrixWorld)
  }

  const lineAlias = line as unknown as { dispose: () => void }

  lineAlias.dispose = () => {
    line.geometry.dispose()

    {
      const lineMaterial = line.material as THREE.MeshBasicMaterial
      lineMaterial.dispose()
    }

    const child = line.children[0] as THREE.Mesh

    child.geometry.dispose()

    {
      const childMaterial = child.material as THREE.MeshBasicMaterial
      childMaterial.dispose()
    }
  }

  return line
}
