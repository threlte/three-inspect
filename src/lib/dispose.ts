export const disposeHelper = (helper?: THREE.Line) => {
  if (helper === undefined) {
    return
  }

  if ('dispose' in helper) {
    // @ts-expect-error This might exist.
    helper.dispose?.()
    return
  }

  helper.geometry.dispose()

  if ((helper.material as THREE.Material).isMaterial) {
    (helper.material as THREE.Material).dispose()
  }
}
