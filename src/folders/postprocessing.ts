
import type * as Postprocessing from 'postprocessing'
import { pane } from '../pane'

export const initPostFolder = (composer?: Postprocessing.EffectComposer) => {
  if (composer === undefined) {
    return () => null
  }

  const postFolder = pane.addFolder({ title: 'Postprocessing' })
  const { passes } = composer

  let effectPass: Postprocessing.EffectPass | undefined

  for (let i = 0, l = passes.length; i < l; i += 1) {
    const pass = passes[i]

    if ('effects' in pass) {
      effectPass = pass as Postprocessing.EffectPass
      break
    }
  }

  if (effectPass === undefined) {
    return () => postFolder.dispose()
  }

  postFolder.addInput(effectPass, 'dithering')

  // This crazy typecasting is done because .effects is private >:|
  const { effects } = (effectPass as unknown as { effects: Postprocessing.Effect[]})

  for (let i = 0, l = effects.length; i < l; i += 1) {
    const effect = effects[i]

    /**
     * SMAA
     */
    if (effect.name === 'SMAAEffect') {
      postFolder.addFolder({ title: 'smaa' })

    /**
     * Bloom
     */
    } else if (effect.name === 'BloomEffect') {
      const bloomEffect = effect as Postprocessing.BloomEffect
      const bloomFolder = postFolder.addFolder({ title: 'bloom' })
      bloomFolder.addInput(bloomEffect, 'height')
      bloomFolder.addInput(bloomEffect, 'width')
      bloomFolder.addInput(bloomEffect, 'intensity')

    /**
     * Noise
     */
    } else if (effect.name === 'NoiseEffect') {
      const noiseFolder = postFolder.addFolder({ title: 'noise' })
      noiseFolder.addInput(effect.blendMode.opacity, 'value', { label: 'opacity' })

    /**
     * Vignette
     */
    } else if (effect.name === 'VignetteEffect') {
      const vignetteEffect = effect as Postprocessing.VignetteEffect
      const vignetteFolder = postFolder.addFolder({ title: 'vignette' })
      vignetteFolder.addInput(vignetteEffect, 'darkness')
      vignetteFolder.addInput(vignetteEffect, 'technique', {
        options: {
          default: 0,
          eskil: 1,
        },
      })
      vignetteFolder.addInput(vignetteEffect, 'offset')

    /**
     * SSR
     */
    } else if (effect.name === 'SSREffect') {
      const index = 0
      const ssrEffect = effect as any
      const ssrFolder = postFolder.addFolder({ title: 'ssr' })
      ssrFolder.addInput(ssrEffect, 'intensity', { max: 3, min: 0, step: 0.01 })
      ssrFolder.addInput(ssrEffect, 'exponent', { max: 8, min: 0.125, step: 0.125 })
      ssrFolder.addInput(ssrEffect, 'distance', { max: 10, min: 0.001, step: 0.1 })
      ssrFolder.addInput(ssrEffect, 'fade', { max: 20, min: 0, step: 0.01 })
      ssrFolder.addInput(ssrEffect, 'roughnessFade', { max: 1, min: 0, step: 0.01 })
      ssrFolder.addInput(ssrEffect, 'thickness', { max: 10, min: 0, step: 0.01 })
      ssrFolder.addInput(ssrEffect, 'ior', { max: 2.33333, min: 1, step: 0.01 })
      ssrFolder.addInput(ssrEffect, 'maxRoughness', { max: 1, min: 0, step: 0.01 })
      ssrFolder.addInput(ssrEffect, 'maxDepthDifference', { max: 100, min: 0, step: 0.1 })

      const temporalResolveFolder = ssrFolder.addFolder({ index, title: 'Temporal Resolve' })
      temporalResolveFolder.addInput(ssrEffect, 'blend', { max: 1, min: 0, step: 0.001 })
      temporalResolveFolder.addInput(ssrEffect, 'correction', { max: 1, min: 0, step: 0.0001 })
      temporalResolveFolder.addInput(ssrEffect, 'correctionRadius', { max: 4, min: 1, step: 1 })

      const blurFolder = ssrFolder.addFolder({ index, title: 'Blur' })
      blurFolder.addInput(ssrEffect, 'blur', { max: 1, min: 0, step: 0.01 })
      blurFolder.addInput(ssrEffect, 'blurKernel', { max: 5, min: 0, step: 1 })
      blurFolder.addInput(ssrEffect, 'blurSharpness', { max: 100, min: 0, step: 1 })

      const jitterFolder = ssrFolder.addFolder({ index, title: 'Jitter' })
      jitterFolder.addInput(ssrEffect, 'jitter', { max: 4, min: 0, step: 0.01 })
      jitterFolder.addInput(ssrEffect, 'jitterRoughness', { max: 4, min: 0, step: 0.01 })

      const definesFolder = ssrFolder.addFolder({ index, title: 'Tracing' })
      definesFolder.addInput(ssrEffect, 'steps', { max: 256, min: 1, step: 1 })
      definesFolder.addInput(ssrEffect, 'refineSteps', { max: 16, min: 0, step: 1 })
      definesFolder.addInput(ssrEffect, 'missedRays')

      const resolutionFolder = ssrFolder.addFolder({ index, title: 'Resolution' })
      resolutionFolder.addInput(ssrEffect, 'resolutionScale', { max: 1, min: 0.125, step: 0.125 })
      resolutionFolder.addInput(ssrEffect, 'velocityResolutionScale', { max: 1, min: 0.125, step: 0.125 })

    /**
     * Unhandled
     */
    } else {
      // eslint-disable-next-line no-console
      console.warn(`three-debug does not yet support postprocessing effect: ${effect.name}`)
    }
  }

  return () => postFolder.dispose()
}
