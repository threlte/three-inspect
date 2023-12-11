# three-inspect

> [!WARNING]  
> `three-inspect` is a Young project, and breaking changes will likely happen before 1.0.0. If you encounter problems please report them!

`three-inspect` is an inspector for Three.js projects. It is designed to be minimalistic, powerful, and extensible, with little boilerplate required.

```bash
npm i --save-dev three-inspect
```

![A screenshot of three-inspect in action](https://raw.githubusercontent.com/michealparks/three-inspect/main/assets/screen.gif)

Currently, it covers:

- Creating a view of the scene graph and editing object properties, such as materials, transforms, etc.
- Viewing / editing textures.
- Scene helpers (Grid / Axes), light helpers, shadow camera helpers.
- Performance monitoring (resources, framerate, memory, capabilities, misc. stats).

`three-inspect` uses [Tweakpane](https://cocopon.github.io/tweakpane/) <3 for its input UI .

### Getting started

`three-inspect` is built with first-class support for [Threlte](https://threlte.xyz), but can be used with most Three.js apps (see Getting started (Vanilla, R3F, TresJS, etc.) below).

If you are using Threlte, simply create the inspector by importing the `<Inspector>` component:

```html
<script>
	import { Canvas } from '@threlte/core'
	import { Inspector } from 'three-inspect'
</script>

<canvas>
	<Inspector />
</canvas>
```

Once running, the inspector can be toggled with the `i` key.

### Extending

`three-inspect` uses [`svelte-tweakpane-ui`](https://kitschpatrol.com/svelte-tweakpane-ui) under the hood, and can be extended by adding additional tweakpane tabs or panes.

```html
<script>
	import { Canvas } from '@threlte/core'
	import { Inspector } from 'three-inspect'

	let foo = 1
	let bar = 0
</script>

<canvas>
	<Inspector>
		<TabPage
			slot="inspector"
			title="world"
		>
			<Slider
				bind:value="{foo}"
				label="Foo"
				min="{1}"
				max="{30}"
			/>
			<Slider
				bind:value="{bar}"
				label="Bar"
				min="{0}"
				max="{1}"
			/>
		</TabPage>
	</Inspector>
</canvas>
```

### Getting started (Vanilla, R3F, TresJS, etc.)

`three-inspect` can be used in any Three.js-based environment by importing the `createInspector` function.

```ts
import { createInspector } from 'three-inspect'

const inspector = createInspector({ scene, camera, renderer })

// When you're finished with the inspector...
inspector.dispose()
```

Note that some features, such as extending the UI, are not possible using this function.
