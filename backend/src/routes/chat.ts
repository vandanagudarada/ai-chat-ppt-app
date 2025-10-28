import { Router } from 'express'
import { AIService } from '../services/aiService'
import { ChatRequest, ChatResponse, ChatMessage } from '../types'

const router = Router()
const aiService = new AIService()

let chatHistory: ChatMessage[] = []
let presentations: Map<number, any> = new Map()
let nextId = 1

router.post('/', async (req, res) => {
  try {
    const { message, context }: ChatRequest = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    chatHistory.push({ role: 'user', content: message })

    const presentation = await aiService.generatePresentation(message, context)

    if (!context) {
      presentation.id = nextId++
      presentations.set(presentation.id, presentation)
    } else if (context.id) {
      presentation.id = context.id
      presentations.set(presentation.id, presentation)
    } else {
      presentation.id = nextId++
      presentations.set(presentation.id, presentation)
    }

    chatHistory.push({ role: 'assistant', content: presentation })

    const response: ChatResponse = {
      success: true,
      data: presentation,
      history: chatHistory
    }

    res.json(response)
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate response',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
router.get('/history', (req, res) => {
  res.json({
    success: true,
    data: chatHistory
  })
})

router.post('/clear', (req, res) => {
  chatHistory = []
  presentations.clear()
  nextId = 1
  res.json({
    success: true,
    message: 'Chat history cleared'
  })
})

router.get('/presentation/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const presentation = presentations.get(id)

  if (!presentation) {
    return res.status(404).json({
      error: 'Presentation not found'
    })
  }

  res.json({
    success: true,
    data: presentation
  })
})

export default router
