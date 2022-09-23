# three-debug

`three-debug` is a debugger for three.js. It is designed to be minimalistic, powerful, and extensible.

![A screenshot of three-debug in action](/assets/screen1.png)

`three-debug` uses [Tweakpane](https://cocopon.github.io/tweakpane/) for its UI.

### Getting started

```bash
npm i -D three-debug
```

Then, in your project:

```ts
/**
 * It is recommended to import this way to ensure that the debugger
 * is entirely tree-shaken in a production environment.
 */

// Using vite, for example:
if (import.meta.env.DEV) {
  const debug = await import('three-debug')
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
