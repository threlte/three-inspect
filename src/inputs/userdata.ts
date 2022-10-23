import type { Pane } from '../pane'

export const addUserdataInput = (pane: Pane, object: THREE.Object3D) => {
  pane.addSeparator()
  const params = { userData: JSON.stringify(object.userData, null, 2) }
  const lineCount = params.userData.split(/\r\n|\r|\n/u).length
  const monitor = pane.addMonitor(params, 'userData', {
    interval: 5_000,
    lineCount,
    multiline: true,
  })

  return () => monitor.dispose()
}
