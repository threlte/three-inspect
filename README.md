# three-debug

`three-debug` is a debugger / inspector for THREE.js. It is designed to be minimalistic, powerful, and extensible, with little boilerplate required.

![A screenshot of three-debug in action](https://raw.githubusercontent.com/michealparks/three-debug/main/assets/screen.gif)

Currently, it covers:
* Creating a tree of the scene graph and viewing /editing object properties, such as materials, transforms, etc.
* Scene helpers (Grid / Axes).
* Performance monitoring (framerate, memory, capabilities, misc. stats).
* Light helpers, shadow camera helpers.
* Postprocessing (only [pmndrs/postprocessing](https://github.com/pmndrs/postprocessing) is supported).

`three-debug` uses [Tweakpane](https://cocopon.github.io/tweakpane/) <3 for its input UI .

### Getting started

```bash
npm i -D three-debug
```

Then, in your project, create the debugger:

```ts
import Debug from 'three-debug'

/**
 * This should be a conditional that is compiled away
 * when building for production to ensure tree-shaking.
 */
if (devMode) {
  const debug = new Debug(
    THREE, /* the THREE object used in your project */
    scene,
    camera,
    renderer,
    composer /* optional */
  )

  /**
   * To get access to camera debugging features, your camera must be in the scene.
   */
  scene.add(camera)

  /**
   * Call this when you wish to remove the debugger,
   * or re-init it with a new scene, camera, etc.
   */
  debug.dispose()
}
```

Creating the debugger will add hooks to `THEE.Object3D.add()` and `remove()` methods so that all objects are automatically registered / deregisterd in the debug tools.

### Extending

By default, the debugger only comes with a "World" pane. Additional panes can be added:

```ts
const pane = debug.addPane('Game')

pane.addInput(parameters, 'scale').on('change', () => {
  mesh.scale.setScalar(parameters.scale)
})
```

This allows you to directly interact with the Tweakpane API.

### Plugins

It's possible to create a plugin for `three-debug`:

```ts
const myPlugin = (debug: Debug) => {
  // Create some inputs and folders...

  return () => {
    // A dispose function.
  }
}

// Then, as the consumer of the plugin...
debug.registerPlugin(myPlugin)
```
