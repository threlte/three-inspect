import type { Pane } from '../pane'
import { disposeHelper } from '../lib/dispose'
import { three } from '../three'

export const addForwardHelperInput = (pane: Pane, object3D: THREE.Object3D) => {
  const helper = new (three().ArrowHelper)()
  helper.setLength(1)

  const params = {
    forwardHelper: false,
  }

  const input = pane.addInput(params, 'forwardHelper').on('change', () => {
    if (params.forwardHelper) {
      object3D.add(helper)
    } else {
      object3D.remove(helper)
    }
  })

  return () => {
    input.dispose()
    object3D.remove(helper)
    disposeHelper(helper as unknown as THREE.Line)
  }
}
