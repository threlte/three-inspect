<script>
	const links = [
		['Threlte Test 1', '/test1'],
		['Threlte Test 2', '/test2'],
		['Threlte Test 3', '/test3'],
		['Threlte Test 4', '/test4'],
		['Threlte Test 6', '/test6'],
		['Vanilla Test', '/vanilla'],
	]
</script>

<nav>
	<ul>
		{#each links as [title, href]}
			<li><a {href}>{title}</a></li>
		{/each}
	</ul>
</nav>

<style>
</style>
