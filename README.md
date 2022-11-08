# three-inspect

`three-inspect` is an inspector for Three.js projects. It is designed to be minimalistic, powerful, and extensible, with little boilerplate required.

![A screenshot of three-inspect in action](https://raw.githubusercontent.com/michealparks/three-inspect/main/assets/screen.gif)

Currently, it covers:
* Creating a tree of the scene graph and viewing / editing object properties, such as materials, textures, transforms, etc.
* Scene helpers (Grid / Axes).
* Performance monitoring (framerate, memory, capabilities, misc. stats).
* Light helpers, shadow camera helpers.
* Postprocessing (only [pmndrs/postprocessing](https://github.com/pmndrs/postprocessing) is supported).

`three-inspect` uses [Tweakpane](https://cocopon.github.io/tweakpane/) <3 for its input UI .

### Getting started

```bash
npm i -D three-inspect
```

Then, in your project, create the inspector:

```ts
import Inspector from 'three-inspect'

/**
 * This should be a conditional that is compiled away
 * when building for production to ensure tree-shaking.
 */
if (devMode) {
  const inspector = new Inspector(
    THREE, /* the THREE object used in your project */
    scene,
    camera,
    renderer,
    composer /* optional */
  )

  /**
   * To get access to camera inspection, your camera must be in the scene.
   */
  scene.add(camera)

  /**
   * Call this when you wish to remove the inspector,
   * or re-init it with a new scene, camera, etc.
   */
  inspector.dispose()
}
```

Creating the inspector will add hooks to `THEE.Object3D.add()` and `remove()` methods so that all objects are automatically registered / deregisterd.

### Extending

By default, the inspector only comes with a "World" pane. Additional panes can be added:

```ts
const pane = inspector.addPane('Game')

pane.addInput(parameters, 'scale').on('change', () => {
  mesh.scale.setScalar(parameters.scale)
})
```

This allows you to directly interact with the Tweakpane API.

### Plugins

It's possible to create a plugin for `three-inspect`:

```ts
const myPlugin = (inspector: Inspector) => {
  // Create some inputs and folders...

  return () => {
    // A dispose function.
  }
}

// Then, as the user of the plugin...
inspector.registerPlugin(myPlugin)
```

### React Three Fiber Usage

```ts
import * as THREE from 'three'
import * as React from 'react'
import { useThree } from '@react-three/fiber'
import Inspector from 'three-inspect'

function App() {
  const state = useThree()

  const inspector = React.useMemo(() => new Inspector(
    THREE, /* the THREE object used in your project */
    state.scene,
    state.camera,
    state.gl,
    composer /* optional */
  ))

  ...
```
