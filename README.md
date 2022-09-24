# three-debug

`three-debug` is a debugger for three.js. It is designed to be minimalistic, powerful, and extensible.

![A screenshot of three-debug in action](https://raw.githubusercontent.com/michealparks/three-debug/main/assets/screen1.jpg)

Currently, it covers:
* Scene helpers
* Camera
* Lights
  * Shadow cameras
* Objects and child objects
* Postprocessing (only [pmndrs/postprocessing](https://github.com/pmndrs/postprocessing) is supported)

`three-debug` uses [Tweakpane](https://cocopon.github.io/tweakpane/) for its UI.

### Getting started

```bash
npm i -D three-debug
```

Then, in your project:

```ts
import debug from 'three-debug'

/**
 * This should be a conditional that is compiled away
 * when building for production to ensure tree-shaking.
 */
if (devMode) {
  debug.init(THREE, scene, camera, renderer, composer)
}
```

### Extending

By default, the debugger only comes with a "World" pane. Additional panes can be added:

```ts
const pane = debug.addPane('game')

pane.addInput(parameters, 'scale').on('change', () => {
  mesh.scale.setScalar(parameters.scale)
})
```

This allows you to directly interact with the Tweakpane API.
