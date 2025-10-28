import { defineComponent } from 'vue'
import { useChatStore } from '@/stores/chat'
import { Presentation } from '@/types'
import { mapState, mapActions } from 'pinia'

export default defineComponent({
  name: 'EditView',
  data() {
    return {
      inputMessage: '',
      chatContainer: null as HTMLElement | null,
      presentation: null as Presentation | null
    }
  },
  computed: {
    ...mapState(useChatStore, [
      'messages',
      'currentPresentation',
      'loading',
      'loadingPPT',
      'currentPPT'
    ]),
  },
  async mounted() {
    const idParam = this.$route.params.id as string
    try {
      this.loadHistory()
      const id = parseInt(idParam)
      if (id && !isNaN(id)) {
        const response = await fetch(`http://localhost:3000/api/chat/presentation/${id}`)
        const data = await response.json()
        if (data.success && data.data) {
          this.presentation = data.data as Presentation
          this.currentPresentation = data.data
          await this.generatePPT(data.data)
        } else {
          this.$router.push('/history')
        }
      } else {
        const encodedData = idParam
        const jsonData = atob(encodedData)
        this.presentation = JSON.parse(jsonData) as Presentation
        this.currentPresentation = this.presentation
        await this.generatePPT(this.presentation)
      }
    } catch (error) {
      console.error('Error loading presentation:', error)
      this.$router.push('/history')
    }
  },
  methods: {
    ...mapActions(useChatStore, ['sendMessage', 'generatePPT', 'downloadCurrentPPT', 'clearHistory', 'loadHistory']),
    goToHome() {
      this.$router.push('/')
    },
    goToHistory() {
      this.$router.push('/history')
    },
    async handleSendMessage() {
      if (!this.inputMessage.trim()) return

      const userMessage = this.inputMessage.trim()
      this.messages.push({
        role: 'user',
        content: userMessage
      })

      this.inputMessage = ''

      try {
        await this.sendMessage(userMessage)
        this.presentation = this.currentPresentation
      } catch (error) {
        console.error('Error sending message:', error)
      }

      this.$nextTick(() => {
        if (this.chatContainer) {
          this.chatContainer.scrollTop = this.chatContainer.scrollHeight
        }
      })
    },
    downloadPPT() {
      this.downloadCurrentPPT()
    },
    formatMessage(content: any): string {
      if (typeof content === 'string') {
        return content
      }
      if (content && content.title) {
        return `Generated presentation: "${content.title}" with ${content.slides?.length || 0} slides`
      }
      return JSON.stringify(content)
    }
  }
})

