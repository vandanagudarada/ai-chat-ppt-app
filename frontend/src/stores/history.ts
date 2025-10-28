import axios from 'axios'
import { defineStore } from 'pinia'
import { Presentation } from '../types'

const API_BASE_URL = 'http://localhost:3000/api'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    presentations: [] as Presentation[],
    loading: false,
    showPreview: false,
    selectedPresentation: null as Presentation | null,
    selectedPPT: null as string | null
  }),

  actions: {
    async loadPresentations() {
      this.loading = true
      const response = await axios.get(`${API_BASE_URL}/chat/history`)
      if (response.data.success && response.data.data) {
        const presentations = response.data.data
          .filter((msg: any) => msg.content && typeof msg.content === 'object' && msg.content.title)
          .map((msg: any) => msg.content)

        const unique = Array.from(new Map(presentations.map((p: Presentation) => [p.title, p])).values())
        this.presentations = unique
      }
      this.loading = false
    },

    async generatePPT(presentation: Presentation): Promise<string | null> {
      const response = await axios.post(`${API_BASE_URL}/ppt/generate`, presentation)
      if (response.data.success) {
        return response.data.data
      }
      return null
    },

    downloadPPT(base64Data: string, filename: string) {
      const binaryString = atob(base64Data)
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
      a.download = `${filename}.pptx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    },

    async previewPresentation(presentation: Presentation) {
      this.selectedPresentation = presentation
      const pptxBase64 = await this.generatePPT(presentation)
      if (pptxBase64) {
        this.selectedPPT = pptxBase64
        this.showPreview = true
      }
    },

    async downloadPresentation(presentation: Presentation) {
      const pptxBase64 = await this.generatePPT(presentation)
      if (pptxBase64) {
        this.downloadPPT(pptxBase64, presentation.title)
      }
    },

    downloadPreview() {
      if (this.selectedPPT && this.selectedPresentation) {
        this.downloadPPT(this.selectedPPT, this.selectedPresentation.title)
      }
    },

    closePreview() {
      this.showPreview = false
      this.selectedPresentation = null
      this.selectedPPT = null
    }
  }
})
