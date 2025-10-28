import { defineComponent } from 'vue'
import { useHistoryStore } from '@/stores/history'
import { mapState, mapActions } from 'pinia'

export default defineComponent({
  name: 'HistoryView',
  data() {
    return {}
  },
  mounted() {
    this.loadPresentations()
  },
  computed: {
    ...mapState(useHistoryStore, [
      'presentations',
      'showPreview',
      'selectedPresentation',
      'selectedPPT'
    ]),
  },
  methods: {
    ...mapActions(useHistoryStore, [
      'loadPresentations',
      'downloadPresentation',
      'previewPresentation',
      'downloadPreview',
      'closePreview'
    ]),
    goToHome() {
      this.$router.push('/')
    },
    editPresentation(presentation: any) {
      if (presentation.id) {
        this.$router.push(`/edit/${presentation.id}`)
      } else {
        const encodedData = btoa(JSON.stringify(presentation))
        this.$router.push(`/edit/${encodedData}`)
      }
    }
  }
})