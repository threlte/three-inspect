<script lang='ts'>
  import * as THREE from 'three'
  import { Inspector } from '$lib'

  const types = {};

  if ('devtools' in chrome) {
    chrome.devtools.inspectedWindow.getResources((resources) => {
      resources.forEach((resource) => {
        if (!(resource.type in types)) {
          types[resource.type] = 0;
        }
        types[resource.type] += 1;
      });
      let result = `Resources on this page: 
      ${Object.entries(types)
        .map((entry) => {
          const [type, count] = entry;
          return `${type}: ${count}`;
        })
        .join('\n')}`;
      let div = document.createElement('div');
      div.innerText = result;
      document.body.appendChild(div);
    });
  }

</script>

<Inspector
  scene={new THREE.Scene()}
  camera={new THREE.PerspectiveCamera()}
  renderer={new THREE.WebGLRenderer()}
/>
