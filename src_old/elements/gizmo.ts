import { ViewHelper } from 'trzy'
import { refs } from '../refs'

export const createViewHelper = () => {
  const { camera, renderer } = refs
  const gizmo = new ViewHelper(camera, renderer)
  return () => gizmo.dispose()
}
