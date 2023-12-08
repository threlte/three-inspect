<script context='module' lang='ts'>
  import { tick } from 'svelte'

  /**
   * Usage: <div use:portal={'css selector'}> or <div use:portal={document.body}>
   *
   * @param {HTMLElement} el
   * @param {HTMLElement|string} target DOM Element or CSS Selector
   */
  export function portal(el: HTMLElement, target: HTMLElement | string = 'body') {
    let targetEl: HTMLElement | null

    async function update(newTarget: HTMLElement | string) {
      target = newTarget
      if (typeof target === 'string') {
        targetEl = document.querySelector(target)
        if (targetEl === null) {
          await tick()
          targetEl = document.querySelector(target)
        }
        if (targetEl === null) {
          throw new Error(
            `No element found matching css selector: '${target}'`
          )
        }
      } else {
        targetEl = target
      }

      targetEl.appendChild(el)
      el.hidden = false
    }

    function destroy() {
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }

    update(target)
    return {
      update,
      destroy,
    }
  }
</script>

<script lang='ts'>
  /**
   * DOM Element or CSS Selector
   */
  export let target: HTMLElement | string = 'body'
</script>

<div use:portal={target} hidden {...$$restProps}>
  <slot />
</div>
