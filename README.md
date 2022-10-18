# three-debug

`three-debug` is a debugger for three.js. It is designed to be minimalistic, powerful, and extensible, with very little configuration and boilerplate required.

![A screenshot of three-debug in action](https://raw.githubusercontent.com/michealparks/three-debug/main/assets/screen.gif)

Currently, it covers:
* Scene helpers
  * Grid
  * Axes
* Camera
  * Helpers
* Lights
  * Shadows
  * Helpers
* Objects
  * Materials
  * Children
* Postprocessing (only [pmndrs/postprocessing](https://github.com/pmndrs/postprocessing) is supported)

`three-debug` uses [Tweakpane](https://cocopon.github.io/tweakpane/) for its UI.

### Getting started

```bash
npm i -D three-debug
```

Then, in your project, create the debugger:

```ts
import debug from 'three-debug'

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
   * Call this when you wish to remove the debugger,
   * or re-init it with a new scene, camera, etc.
   */
  debug.dispose()
}
```

Creating the debugger will add hooks to `add()` and `remove()` methods so that all objects are automatically registered / deregisterd.

Additionally, the debugger will do its best to "try" to remember which debugging panes were open / closed between page refreshes.

### Keyboard shortcuts

* `shift + ~` - previous pane
* `shift + !` - next pane

### Extending

By default, the debugger only comes with a "World" pane. Additional panes can be added:

```ts
const pane = debug.addPane('game')

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
