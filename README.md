# three-inspect

`three-inspect` is an inspector for Three.js projects. It is designed to be minimalistic, powerful, and extensible, with little boilerplate required.

![A screenshot of three-inspect in action](https://raw.githubusercontent.com/michealparks/three-inspect/main/assets/screen.gif)

Currently, it covers:
* Creating a view of the scene graph and editing object properties, such as materials, transforms, etc.
* Viewing / editing textures.
* Scene helpers (Grid / Axes).
* Showing and editing shaders.
* Performance monitoring (resources, framerate, memory, capabilities, misc. stats).
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
  const inspector = new Inspector({
    scene,
    camera,
    renderer,
    composer /* optional */
    options: { /* optional */
      location: 'right' /* can be 'right' or 'overlay'. Default: 'right' */
    }
  })

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

You may notice that nothing has happened! That is because the inspector will be triggered by pressing the `i` key. If you wish to re-map this, just send the key you want to the constructor:

new Inspector({ ..., options: { toggle: 'enter' } })

Creating the inspector will add hooks to `THEE.Object3D.add()` and `remove()` methods so that all objects are automatically registered / deregisterd.

### Extending

By default, the inspector only comes with a primary tab, but additional panes can be added:

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
import * as React from 'react'
import { useThree } from '@react-three/fiber'
import Inspector from 'three-inspect'

function App() {
  const state = useThree()

  const inspector = React.useEffect(() => {
    const { dispose } = new Inspector({
      scene: state.scene,
      camera: state.camera,
      renderer: state.gl,
    })

    return () => dispose()
  }), [state.scene, state.camera])

  ...
```

### Threlte usage

This library is build using Threlte, so a component can be directly imported.

```html
<script lang='ts'>

import { Canvas } from '@threlte/core'
import { Inspect } from 'three-inspect'

</script>

<Canvas>
  <Inspect />
</Canvas>
```
