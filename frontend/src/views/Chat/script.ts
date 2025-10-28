import { defineComponent } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useRouter } from 'vue-router'
import { mapState, mapActions } from 'pinia'

export default defineComponent({
  name: 'ChatView',
  setup() {
    const router = useRouter()
    return {
      router
    }
  },
  data() {
    return {
      inputMessage: '',
      chatContainer: null as HTMLElement | null
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
  methods: {
    ...mapActions(useChatStore, [
      'sendMessage',
      'downloadCurrentPPT',
      'clearHistory'
    ]),
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
      } catch (error) {
        console.error('Error sending message:', error)
      }

      // Scroll to bottom
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
