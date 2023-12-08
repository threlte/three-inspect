export const usePortal = (node: HTMLElement) => {
  const target = document.body
  target.appendChild(node)

  return {
    destroy() {
      target.removeChild(node)
    },
  }
}
