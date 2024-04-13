/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable unicorn/no-unused-properties */

import {
	Vector3,
	type Color,
	type DirectionalLight,
	type HemisphereLight,
	type Light,
	type Material,
	type Mesh,
	type Object3D,
	type OrthographicCamera,
	type PerspectiveCamera,
	type PointLight,
	type RectAreaLight,
	type Scene,
	type SpotLight,
} from 'three'
import type { Transaction } from '../transactions/TransactionQueue'
import { buildTransaction } from './buildTransaction'

export type Attribute = (object: any) => boolean

type Property = {
	/** The label of the property, typically corresponds to the property name, e.g. "position" */
	label: string
	/** Read the value from the object and return a format that svelte-tweakpane-ui understands */
	read: (object: any) => any
	/** Build a transaction to be used to actually apply a new value */
	buildTransaction: (object: any, value: any) => Transaction<any, any>
}

type Binding = {
	attributes: Attribute | Attribute[]
	folder?: {
		label: string
		open: boolean
	}
	properties: Property[]
}

type Bindings = Binding[]

const attributes = {
	isObject3D: (object: any): object is Object3D => 'isObject3D' in object,
	isScene: (object: any): object is Scene => 'isScene' in object,
	mesh: {
		isMesh: (object: any): object is Mesh => 'isMesh' in object,
		material: {
			hasMaterial: (object: any): object is { material: Material } => 'material' in object,
			hasColor: (object: any): object is { material: { color: Color } } => {
				return 'material' in object && 'color' in object.material
			},
		},
	},
	isLight: (object: any): object is Light => 'isLight' in object,
	isPointLight: (object: any): object is PointLight => 'isPointLight' in object,
	isSpotLight: (object: any): object is SpotLight => 'isSpotLight' in object,
	isDirectionalLight: (object: any): object is DirectionalLight => 'isDirectionalLight' in object,
	isPerspectiveCamera: (object: any): object is PerspectiveCamera =>
		'isPerspectiveCamera' in object,
	isOrthographicCamera: (object: any): object is OrthographicCamera =>
		'isOrthographicCamera' in object,
	isHemisphereLight: (object: any): object is HemisphereLight => 'isHemisphereLight' in object,
	isRectAreaLight: (object: any): object is RectAreaLight => 'isRectAreaLight' in object,
}

export const defaultBindings: Bindings = [
	{
		attributes: attributes.isObject3D,
		properties: [
			{
				label: 'visible',
				read(object) {
					return object.visible
				},
				buildTransaction(object, value) {
					return {
						object,
						read(root) {
							return root.visible
						},
						write(root, data) {
							root.visible = data
						},
						value,
						sync: {
							attributeName: 'visible',
							attributeValue: (value: boolean) => value,
							parserType: 'json',
							object,
						},
					}
				},
			},
			{
				label: 'position',
				read: (object) => ({
					x: object.position.x,
					y: object.position.y,
					z: object.position.z,
				}),
				buildTransaction: (object, value) => {
					return buildTransaction(object, 'position', new Vector3(value.x, value.y, value.z))
				},
			},
			// {
			// 	label: 'scale',
			// 	read: (object: Object3D) => ({ x: object.scale.x, y: object.scale.y, z: object.scale.z }),
			// 	apply(object: Object3D, value: { x: number; y: number; z: number }) {
			// 		object.scale.set(value.x, value.y, value.z)
			// 	},
			// 	sync: (value) => [value.x, value.y, value.z],
			// 	default: { x: 1, y: 1, z: 1 },
			// },
			// {
			// 	label: 'renderOrder',
			// 	read: (object: Object3D) => object.renderOrder,
			// 	apply(object: Object3D, value: number) {
			// 		object.renderOrder = value
			// 	},
			// 	default: 0,
			// },
		],
	},
	// {
	// 	attributes: [
	// 		attributes.mesh.isMesh,
	// 		attributes.mesh.material.hasMaterial,
	// 		attributes.mesh.material.hasColor,
	// 	],
	// 	folder: {
	// 		label: 'Material',
	// 		open: false,
	// 	},
	// 	properties: [
	// 		{
	// 			label: 'color',
	// 			read: (object: { material: Material }) => `#${object.material.color.getHexString()}`,
	// 			apply(object: { material: Material }, value: number) {
	// 				object.material.color.set(value)
	// 			},
	// 			default: '#ffffff',
	// 		},
	// 	],
	// },
]
