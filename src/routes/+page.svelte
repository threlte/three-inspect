<script>
  const links = [
    ['Test1', '/test1'],
    ['Test2', '/test2'],
    ['Test3', '/plane'],
  ]
</script>
<nav>
  <ul>
    {#each links as [title, href]}
      <li><a {href}>{title}</a></li>
    {/each}
  </ul>
</nav>

