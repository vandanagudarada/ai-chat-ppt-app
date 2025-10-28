import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import chatRouter from './routes/chat.js'
import pptRouter from './routes/ppt.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/chat', chatRouter)
app.use('/api/ppt', pptRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: Date.now() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})