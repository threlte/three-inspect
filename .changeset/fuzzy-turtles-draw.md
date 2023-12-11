---
"three-inspect": minor
---

Rewrite inspector, with a focus on Svelte & Threlte support

### Migration guide

The inspector now contains new features when used with Svelte / Threlte. See the Readme for details.

Adding the inspector for Vanilla environments has changed:

```ts
import { createInspector } from 'three-inspect'

const inspector = createInspector({ scene, camera, renderer })

// When you're finished with the inspector...
inspector.dispose()
```
