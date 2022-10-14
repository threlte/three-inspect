import type { Pane } from '../pane'

export const addGeometryInputs = (pane: Pane, mesh: THREE.Mesh) => {
  const { geometry } = mesh

  if (!geometry.isBufferGeometry) {
    return () => null
  }

  const { attributes } = geometry

  // console.log(mesh, attributes)
}
