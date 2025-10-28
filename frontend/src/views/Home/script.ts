import { defineComponent } from 'vue'
import { useChatStore } from '@/stores/chat'
import { mapActions } from 'pinia'

export default defineComponent({
  name: 'HomeView',
  data() {
    return {}
  },
  methods: {
    ...mapActions(useChatStore, ['clearHistory']),
    goToChat() {
      this.clearHistory()
      this.$router.push('/chat')
    },
    goToHistory() {
      this.$router.push('/history')
    }
  }
})

