export interface WindowMetadata {
  title: string
  url?: string
  language?: string
}

export const extractWindowMetadata = (): WindowMetadata => ({
  title: document.title,
  url: window.location.href,
  language: document.documentElement.lang,
})

export default extractWindowMetadata
