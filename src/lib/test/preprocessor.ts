import MagicString from 'magic-string'
import {
	Preprocessor,
	type PreprocessorGroup,
	walk,
	compile,
	preprocess,
	parse,
} from 'svelte/compiler'

export const preprocessor: PreprocessorGroup = {
	markup: ({ filename, content }) => {
		const ast = parse(content)
		const mc = new MagicString(content)

		walk(ast.html, {
			enter(node, parent, key, index) {
				if (node.type === 'InlineComponent' && node.name.startsWith('T.')) {
					const nodeNameLen = node.name.length + 1 // account for "<"
					const str = ` inspectorOptions={{ filename: ${filename}, start: ${node.start} }}`
					mc.appendLeft(node.start + nodeNameLen, str)
				}
			},
		})

		return {
			code: mc.toString(),
		}
	},
}

// const start = async () => {
// 	const testComponent = Bun.file('Test.svelte')
// 	const text = (await testComponent.text()) as string

// 	const preprocessed = await preprocess(text, preprocessor, {
// 		filename: 'Test.svelte',
// 	})

// 	const x = preprocessed.code
// 	console.log(x)
// }

// start()
