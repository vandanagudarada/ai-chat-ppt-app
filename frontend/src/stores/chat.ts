import { defineStore } from 'pinia'
import axios from 'axios'
import { Presentation, ChatMessage } from '../types'

const API_BASE_URL = 'http://localhost:3000/api'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMessage[],
    currentPresentation: null as Presentation | null,
    currentPPT: null as string | null,
    loading: false,
    loadingPPT: false
  }),

  actions: {
    async sendMessage(message: string) {
      this.loading = true
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message,
        context: this.currentPresentation
      })

      if (response.data.success) {
        this.messages.push({
          role: 'assistant',
          content: response.data.data
        })

        this.currentPresentation = response.data.data

        // Auto-generate PPT
        if (this.currentPresentation) {
          await this.generatePPT(this.currentPresentation)
        }
      }
      this.loading = false
    },

    async generatePPT(presentation: Presentation) {
      this.loadingPPT = true
      const response = await axios.post(`${API_BASE_URL}/ppt/generate`, presentation)

      if (response.data.success) {
        this.currentPPT = response.data.data
      }
      
      this.loadingPPT = false
    },

    downloadCurrentPPT() {
      if (!this.currentPPT) return

      const binaryString = atob(this.currentPPT)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      })

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const title = this.currentPresentation?.title || 'presentation'
      a.download = `${title}.pptx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    },

    async loadHistory() {
      const response = await axios.get(`${API_BASE_URL}/chat/history`)
      if (response.data.success && response.data.data.length) {
        this.messages = response.data.data
      }
    },

    async clearHistory() {
      await axios.post(`${API_BASE_URL}/chat/clear`)
      this.messages = []
      this.currentPresentation = null
      this.currentPPT = null
    }
  }
})
