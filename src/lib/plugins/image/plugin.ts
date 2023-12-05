/* eslint-disable unicorn/no-null */
import {
  type BaseInputParams,
  BindingTarget,
  type InputBindingPlugin,
  parseRecord
} from '@tweakpane/core'
import type { ImageResolvable } from './model'
import { PluginController } from './controller'

export interface PluginInputParams extends BaseInputParams {
  view: 'input-image';
  imageFit?: 'contain' | 'cover';
  extensions?: string[];
}

const DEFAULT_EXTENSIONS = ['.jpg', '.png', '.gif']

export const TweakpaneImagePlugin: InputBindingPlugin<
  ImageResolvable,
  ImageResolvable,
  PluginInputParams
> = {
  id: 'input-image',
  type: 'input',
  css: '__css__',

  accept (exValue: unknown, params: Record<string, unknown>) {
    if (!(exValue instanceof HTMLImageElement || typeof exValue === 'string')) {
      return null
    }

    const result = parseRecord<PluginInputParams>(params, (p) => ({
      view: p.required.constant('input-image'),
      acceptUrl: p.optional.boolean,
      imageFit: p.optional.custom((v) => (v === 'contain' || v === 'cover' ? v : undefined)),
      extensions: p.optional.array(p.required.string),
    }))

    if (!result) {
      return null
    }

    return {
      initialValue: exValue,
      params: result,
    }
  },

  binding: {
    reader (_args) {
      return (exValue: unknown): ImageResolvable => {
        if (exValue instanceof HTMLImageElement) {
          return exValue.src === '' ? 'placeholder' : exValue.src
        }
        return typeof exValue === 'string' ? exValue : 'placeholder'
      }
    },

    writer (_args) {
      return (target: BindingTarget, inValue) => {
        target.write(inValue)
      }
    },
  },

  controller (args) {
    return new PluginController(args.document, {
      value: args.value,
      imageFit: args.params.imageFit ?? 'cover',
      viewProps: args.viewProps,
      extensions: args.params.extensions ?? DEFAULT_EXTENSIONS,
    })
  },
}
