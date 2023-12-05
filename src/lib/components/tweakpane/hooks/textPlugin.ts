import { BladeController, BladeApi, createBlade, ClassName } from '@tweakpane/core'
import type { View } from '@tweakpane/core'

const className = ClassName('ph')

class TextView implements View {
  element: HTMLElement
  constructor (doc: any, config: any) {
    this.element = doc.createElement('div')
    this.element.classList.add(className())
    config.viewProps.bindClassModifiers(this.element)

    const textElement = doc.createElement('div')
    textElement.classList.add(className('t'))
    textElement.textContent = config.text
    this.element.append(textElement)
  }
}

class TextController extends BladeController {
  constructor (doc, config) {
    super({
      blade: createBlade(),
      view: new TextView(doc, config),
      viewProps: config.viewProps,
    })
  }
}

export const TextPlugin = {
  id: 'text',
  type: 'blade',
  css: `.tp-phv {
  align-items: center;
  display: flex;
  height: var(--bld-us);
  position: relative;
}
.tp-phv::before {
  border: var(--tw-prose-body) dashed 1px;
  border-radius: var(--elm-br);
  bottom: 0;
  content: '';
  left: var(--cnt-v-p);
  opacity: 0.3;
  position: absolute;
  right: var(--cnt-v-p);
  top: 0;
}
.tp-phv_t {
  box-sizing: border-box;
  color: var(--mo-fg);
  flex: 1;
  padding: 4px;
  text-align: center;
}
`,
  accept (params) {
    const p = tpC.ParamsParsers
    const r = tpC.parseParams(params, {
      lineCount: p.optional.number,
      text: p.required.string,
      view: p.required.constant('text'),
    })
    return r ? { params: r } : null
  },
  controller (args) {
    return new TextController(args.document, {
      lineCount: args.params.lineCount ?? 1,
      text: args.params.text,
      viewProps: args.viewProps,
    })
  },
  api (args: ) {
    if (!(args.controller instanceof TextController)) {
      return null
    }
    return new BladeApi(args.controller)
  },
}
