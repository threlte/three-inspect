/* eslint-disable unicorn/no-unused-properties */

import type {
	DirectionalLight,
	HemisphereLight,
	Light,
	Material,
	Mesh,
	Object3D,
	OrthographicCamera,
	PerspectiveCamera,
	PointLight,
	RectAreaLight,
	Scene,
	SpotLight,
} from 'three'

export type Attribute = (object: any) => boolean
export type Read<T> = (object: T) => any
export type Apply<T> = (object: T, value: any) => void

type Property = {
	label: string
	read: Read<any>
	apply: Apply<any>
}

type Binding = {
	attribute: Attribute
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
	isMesh: (object: any): object is Mesh => 'isMesh' in object,
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
	hasMaterial: (object: any): object is { material: Material } => 'material' in object,
}

export const defaultBindings: Bindings = [
	{
		attribute: attributes.isObject3D,
		properties: [
			{
				label: 'visible',
				read: (object: Object3D) => object.visible,
				apply(object: Object3D, value: boolean) {
					object.visible = value
				},
			},
			{
				label: 'position',
				read: (object: Object3D) => ({
					x: object.position.x,
					y: object.position.y,
					z: object.position.z,
				}),
				apply(object: Object3D, value: { x: number; y: number; z: number }) {
					object.position.set(value.x, value.y, value.z)
				},
			},
			{
				label: 'rotation',
				read: (object: Object3D) => ({
					x: object.rotation.x,
					y: object.rotation.y,
					z: object.rotation.z,
				}),
				apply(object: Object3D, value: { x: number; y: number; z: number }) {
					object.rotation.set(value.x, value.y, value.z)
				},
			},
			{
				label: 'scale',
				read: (object: Object3D) => ({ x: object.scale.x, y: object.scale.y, z: object.scale.z }),
				apply(object: Object3D, value: { x: number; y: number; z: number }) {
					object.scale.set(value.x, value.y, value.z)
				},
			},
			{
				label: 'renderOrder',
				read: (object: Object3D) => object.renderOrder,
				apply(object: Object3D, value: number) {
					object.renderOrder = value
				},
			},
		],
	},
	{
		attribute: attributes.hasMaterial,
		folder: {
			label: 'Material',
			open: false,
		},
		properties: [
			{
				label: 'color',
				read: (object: { material: Material }) => `#${object.material.color.getHexString()}`,
				apply(object: { material: Material }, value: number) {
					object.material.color.set(value)
				},
			},
		],
	},
]
