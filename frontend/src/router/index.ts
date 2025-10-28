import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/index.vue'
import ChatView from '../views/Chat/index.vue'
import HistoryView from '../views/History/index.vue'
import EditView from '../views/Edit/index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/chat',
      name: 'Chat',
      component: ChatView
    },
    {
      path: '/history',
      name: 'History',
      component: HistoryView
    },
    {
      path: '/edit/:id',
      name: 'Edit',
      component: EditView
    }
  ]
})

export default router