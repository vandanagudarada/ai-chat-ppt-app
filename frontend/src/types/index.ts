export interface Presentation {
  id?: number
  title: string
  slides: Slide[]
}

export interface Slide {
  title: string
  content: Array<{ header?: string; text?: string }>
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string | Presentation
}