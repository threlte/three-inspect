const base = 'https://threejs.org/docs/#api'
const lang = 'en'

export const useDocs = (part: string, page: string) => {
  return (key: string) => {
    window.open(`${base}/${lang}/${part}/${page}.${key}`, '_tab')
  }
}

