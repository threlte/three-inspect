
import type * as Postprocessing from 'postprocessing'
import { addFolder, pane } from '../pane'

export const initPostFolder = (composer?: Postprocessing.EffectComposer) => {
  if (composer === undefined) {
    return () => {
      /* No-op */
    }
  }

  const postFolder = addFolder(pane, 'postprocessing')

  let effectPass: Postprocessing.EffectPass | undefined

  for (const pass of composer.passes) {
    if ('effects' in pass) {
      effectPass = pass as Postprocessing.EffectPass
      break
    }
  }

  if (effectPass === undefined) {
    return () => {
      /* No-op */
    }
  }

  postFolder.addInput(effectPass, 'dithering')

  // This crazy typecasting is done because .effects is private >:|
  for (const effect of (effectPass as unknown as { effects: Postprocessing.Effect[]}).effects) {
    if (effect.name === 'SMAAEffect') {
      addFolder(postFolder, 'smaa')
    }

    if (effect.name === 'BloomEffect') {
      const bloomEffect = effect as Postprocessing.BloomEffect
      const bloomFolder = addFolder(postFolder, 'bloom')
      bloomFolder.addInput(bloomEffect, 'height')
      bloomFolder.addInput(bloomEffect, 'width')
      bloomFolder.addInput(bloomEffect, 'intensity')
    }

    if (effect.name === 'NoiseEffect') {
      const noiseFolder = addFolder(postFolder, 'noise')
      noiseFolder.addInput(effect.blendMode.opacity, 'value', { label: 'opacity' })
    }

    if (effect.name === 'VignetteEffect') {
      const vignetteEffect = effect as Postprocessing.VignetteEffect
      const vignetteFolder = addFolder(postFolder, 'vignette')
      vignetteFolder.addInput(vignetteEffect, 'darkness')
      vignetteFolder.addInput(vignetteEffect, 'technique', {
        options: {
          default: 0,
          eskil: 1,
        },
      })
      vignetteFolder.addInput(vignetteEffect, 'offset')
    }
  }

  return () => {
    /* No-op */
  }

  // const ssrFolder = addFolder(folder, 'ssr')
  // ssrFolder.addInput(ssrEffect, 'intensity', {
  //   max: 3,
  //   min: 0,
  //   step: 0.01,
  // })
  // ssrFolder.addInput(ssrEffect, 'exponent', {
  //   max: 8,
  //   min: 0.125,
  //   step: 0.125,
  // })
  // ssrFolder.addInput(ssrEffect, 'distance', {
  //   max: 10,
  //   min: 0.001,
  //   step: 0.1,
  // })
  // ssrFolder.addInput(ssrEffect, 'fade', {
  //   max: 20,
  //   min: 0,
  //   step: 0.01,
  // })
  // ssrFolder.addInput(ssrEffect, 'roughnessFade', {
  //   max: 1,
  //   min: 0,
  //   step: 0.01,
  // })
  // ssrFolder.addInput(ssrEffect, 'thickness', {
  //   max: 10,
  //   min: 0,
  //   step: 0.01,
  // })
  // ssrFolder.addInput(ssrEffect, 'ior', {
  //   max: 2.33333,
  //   min: 1,
  //   step: 0.01,
  // })
  // ssrFolder.addInput(ssrEffect, 'maxRoughness', {
  //   max: 1,
  //   min: 0,
  //   step: 0.01,
  // })
  // ssrFolder.addInput(ssrEffect, 'maxDepthDifference', {
  //   max: 100,
  //   min: 0,
  //   step: 0.1,
  // })

  // const temporalResolveFolder = addFolder(ssrFolder, 'Temporal Resolve')
  // temporalResolveFolder.addInput(ssrEffect, 'blend', {
  //   max: 1,
  //   min: 0,
  //   step: 0.001,
  // })
  // temporalResolveFolder.addInput(ssrEffect, 'correction', {
  //   max: 1,
  //   min: 0,
  //   step: 0.0001,
  // })
  // temporalResolveFolder.addInput(ssrEffect, 'correctionRadius', {
  //   max: 4,
  //   min: 1,
  //   step: 1,
  // })

  // const blurFolder = addFolder(ssrFolder, 'Blur')
  // blurFolder.addInput(ssrEffect, 'blur', {
  //   max: 1,
  //   min: 0,
  //   step: 0.01,
  // })
  // blurFolder.addInput(ssrEffect, 'blurKernel', {
  //   max: 5,
  //   min: 0,
  //   step: 1,
  // })
  // blurFolder.addInput(ssrEffect, 'blurSharpness', {
  //   max: 100,
  //   min: 0,
  //   step: 1,
  // })

  // const jitterFolder = addFolder(ssrFolder, 'Jitter')
  // jitterFolder.addInput(ssrEffect, 'jitter', {
  //   max: 4,
  //   min: 0,
  //   step: 0.01,
  // })
  // jitterFolder.addInput(ssrEffect, 'jitterRoughness', {
  //   max: 4,
  //   min: 0,
  //   step: 0.01,
  // })

  // const definesFolder = addFolder(ssrFolder, 'Tracing')
  // definesFolder.addInput(ssrEffect, 'steps', {
  //   max: 256,
  //   min: 1,
  //   step: 1,
  // })
  // definesFolder.addInput(ssrEffect, 'refineSteps', {
  //   max: 16,
  //   min: 0,
  //   step: 1,
  // })
  // definesFolder.addInput(ssrEffect, 'missedRays')

  // const resolutionFolder = addFolder(ssrFolder, 'Resolution')
  // resolutionFolder.addInput(ssrEffect, 'resolutionScale', {
  //   max: 1,
  //   min: 0.125,
  //   step: 0.125,
  // })
  // resolutionFolder.addInput(ssrEffect, 'velocityResolutionScale', {
  //   max: 1,
  //   min: 0.125,
  //   step: 0.125,
  // })
}
