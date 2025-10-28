import { Router } from 'express'
import { PPTService } from '../services/pptService'
import { PPTRequest, PPTResponse } from '../types'

const router = Router()
const pptService = new PPTService()

router.post('/generate', async (req, res) => {
  try {
    const { title, slides }: PPTRequest = req.body

    if (!slides || !Array.isArray(slides)) {
      return res.status(400).json({ error: 'Invalid slide data' })
    }

    const presentation = {
      title: title || 'Presentation',
      slides: slides
    }

    const pptxBase64 = await pptService.generatePPT(presentation)

    const response: PPTResponse = {
      success: true,
      data: pptxBase64,
      message: 'PowerPoint generated successfully'
    }

    res.json(response)
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate PowerPoint',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router