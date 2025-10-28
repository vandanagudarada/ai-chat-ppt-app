export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string | Presentation
}

export interface Presentation {
  id?: number
  title: string
  slides: Slide[]
}

export interface Slide {
  title: string
  content: Array<{ header?: string; text?: string }>
}

export interface ChatRequest {
  message: string
  context?: Presentation
}

export interface ChatResponse {
  success: boolean
  data: Presentation
  history: ChatMessage[]
}

export interface PPTRequest {
  id?: number
  title: string
  slides: Slide[]
}

export interface PPTResponse {
  success: boolean
  data: string
  message?: string
}