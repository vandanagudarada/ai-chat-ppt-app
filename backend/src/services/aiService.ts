import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import { Presentation, ChatMessage } from '../types'

dotenv.config()

export class AIService {
  private model: any
  private genAI: GoogleGenerativeAI
  private modelName: string = 'gemini-2.5-pro' // Use latest pro model

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
    // Try gemini-2.5-pro, fallback to gemini-2.5-flash if pro fails
    this.model = this.genAI.getGenerativeModel({ model: this.modelName })
  }

  async generatePresentation(message: string, context?: Presentation): Promise<Presentation> {
    const isEditingMode = context != null && context.slides && context.slides.length > 0

    const systemPrompt = `You are an AI assistant that generates and edits PowerPoint presentation content based on user prompts.
Generate your response in a structured JSON format that can be used to create slides.

Your response should be a JSON object with the following structure:
{
  "title": "Presentation Title",
  "slides": [
    {
      "title": "Slide Title",
      "content": [
        {
          "header": "Sub-header text (will be bold)",
          "text": "Regular descriptive text"
        }
      ]
    }
  ]
}

IMPORTANT FORMATTING RULES:
- Use objects with "header" and "text" fields to create bold sub-headers followed by regular text
- Example: {"header": "Lack of Personalization:", "text": "One-size-fits-all plans lead to poor results"}
- If a bullet point has both a bold part and regular part, separate them
- If a bullet point is only regular text, use: {"text": "Just regular text here"}
- Always structure content as an array of objects with header and/or text properties

CRITICAL: When text contains a label followed by a colon (e.g., "Goal: Description" or "Target: Details"), you MUST split this into header and text:
- Extract the word/phrase before the colon as the "header" field
- Extract everything after the colon as the "text" field
- Example: "Goal: Recruit skilled developers" should become {"header": "Goal:", "text": "Recruit skilled developers"}

Always detect and split colon-separated patterns to ensure proper bold formatting!

${isEditingMode ? `
EDITING MODE - IMPORTANT RULES:
When editing an existing presentation, you MUST follow these guidelines:

1. INTERPRET USER INTENT: Analyze the user's message to understand what they want:
   - "Add more slides about..." → Add NEW slides while keeping existing ones
   - "Update the first slide" → Modify only the specified slide
   - "Change the title to..." → Update the title
   - "Make it more detailed" → Enhance existing content with more details
   - General prompts → Update relevant slides or add new ones based on the prompt

2. PRESERVE CONTEXT: Keep the overall structure and flow of the presentation
3. KEEP UNCHANGED SLIDES: Only modify slides that the user wants to change
4. ADD NEW CONTENT: When appropriate, add new slides to expand the presentation
5. MAINTAIN CONSISTENCY: Ensure the title and all slides are coherent and consistent
6. OVERWRITE WHEN EXACTLY SPECIFIED: Only replace entire slides when the user explicitly asks to replace them


Now, analyze the current presentation context below and the user's prompt to determine what changes to make.`

 : `
CREATING MODE:
Generate a complete new professional, informative presentation based on the user's prompt.`}`

    let fullPrompt = systemPrompt + '\n\nUser prompt: ' + message

    if (isEditingMode && context != null) {
      fullPrompt += '\n\n=== CURRENT PRESENTATION CONTEXT ==='
      fullPrompt += '\n' + JSON.stringify(context, null, 2)
      fullPrompt += '\n=== END CURRENT CONTEXT ==='
      fullPrompt += '\n\nNow analyze the user prompt above and update the presentation accordingly. Return the COMPLETE updated presentation (preserve unchanged slides, modify specified slides, add new slides as needed).'
    }

    return await this.tryGenerateWithFallback(fullPrompt)
  }

  private async tryGenerateWithFallback(fullPrompt: string): Promise<Presentation> {
    const modelsToTry = [
      'gemini-2.5-pro-preview-05-06',
      'gemini-2.5-pro',
      'gemini-2.5-flash',
      'gemini-2.0-flash'
    ]

    for (let i = 0; i < modelsToTry.length; i++) {
      const modelName = modelsToTry[i]
      try {
        const model = this.genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent(fullPrompt)
        const response = await result.response
        const text = response.text()

        return await this.parseAIResponse(text)
      } catch (error) {
        if (modelName === modelsToTry[modelsToTry.length - 1]) {
          throw error
        }
      }
    }

    throw new Error('All models failed')
  }

  private async parseAIResponse(text: string): Promise<Presentation> {
    let jsonContent: Presentation
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/)
      const jsonString = jsonMatch ? jsonMatch[1] : text
      jsonContent = JSON.parse(jsonString)
    } catch (error) {
      jsonContent = {
        title: "AI Generated Presentation",
        slides: [
          {
            title: "Slide 1",
            content: [{ text: text.substring(0, 100) }]
          }
        ]
      }
    }

    return jsonContent
  }
}

