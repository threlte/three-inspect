type ThrelteStudioUserData = {
	index: number
	moduleId: string
	signature: string
}

export const getThrelteStudioUserData = (object: any): ThrelteStudioUserData | undefined => {
	return object.userData.threlteStudio as ThrelteStudioUserData
}
