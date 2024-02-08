# three-inspect

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
  import { createInspector } from "three-inspect";

  const inspector = createInspector({ scene, camera, renderer });

  // When you're finished with the inspector...
  inspector.dispose();
  ```
