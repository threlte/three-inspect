# three-inspect

## 0.7.0

### Minor Changes

- df3d429: Fix svelte export in package.json

## 0.6.0

### Minor Changes

- a0abc79: Remove svelte-splitpanes dependency

## 0.5.1

### Patch Changes

- d059479: Fix perf monitor in vanilla environments

## 0.5.0

### Minor Changes

- d027853: Package css into vanilla export

## 0.4.5

### Patch Changes

- ec73856: upgrade dependencies

## 0.4.4

### Patch Changes

- 11df0e0: Add /vanilla export

## 0.4.3

### Patch Changes

- 2803c98: Fix exports for vanilla projects

## 0.4.2

### Patch Changes

- 6386082: Preserve free camera state between reloads.

## 0.4.1

### Patch Changes

- 3c83df6: Add default camera panel when using free camera, remove style that touched <body> tag.

## 0.4.0

### Minor Changes

- 49868fe: Rewrite inspector, with a focus on Svelte & Threlte support

  ### Migration guide

  The inspector now contains new features when used with Svelte / Threlte. See the Readme for details.

  Adding the inspector for Vanilla environments has changed:

  ```ts
  import { createInspector } from 'three-inspect'

  const inspector = createInspector({ scene, camera, renderer })

  // When you're finished with the inspector...
  inspector.dispose()
  ```
