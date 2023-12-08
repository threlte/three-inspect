chrome.devtools.panels.create(
	'Three Inspect',
	'/icons/icon128.png',
	'devtool-panel.html',
  () => {
    console.log('user switched to this panel')
  }
)
