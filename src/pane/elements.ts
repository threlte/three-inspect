
export const container = document.createElement('div')
container.classList.add('three-debug', 'visible')

export const nav = document.createElement('nav')
nav.classList.add('three-debug-nav', 'tp-rotv')
container.append(nav)

export const top = document.createElement('div')
top.classList.add('three-debug-top')
container.append(top)

export const resizer = document.createElement('div')
resizer.classList.add('three-debug-resizer')
container.append(resizer)
