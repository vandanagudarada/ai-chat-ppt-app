import { Presentation } from '../types'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const PptxGenJS = require('pptxgenjs')

export class PPTService {
  private detectTheme(presentation: Presentation): { background: string, accentColor: string, titleColor: string } {
    const title = presentation.title.toLowerCase()
    const allContent = JSON.stringify(presentation.slides).toLowerCase()

    // Breakfast & Food themes
    if (title.includes('breakfast') || title.includes('recipe') || title.includes('food') ||
        allContent.includes('recipe') || allContent.includes('cooking')) {
      return {
        background: 'F8F0E6', // Warm beige
        accentColor: '8B4513', // Saddle brown
        titleColor: 'CD853F' // Peru/brown-gold
      }
    }

    // Business themes
    if (title.includes('business') || title.includes('corporate') || title.includes('strategy') ||
        title.includes('market') || title.includes('sales') || allContent.includes('roi') || allContent.includes('revenue')) {
      return {
        background: 'E8F4F8', // Light blue-grey
        accentColor: '2C5AA0', // Business blue
        titleColor: '1E3A8A' // Navy blue
      }
    }

    // Tech themes
    if (title.includes('tech') || title.includes('software') || title.includes('digital') ||
        title.includes('ai') || title.includes('technology') || allContent.includes('code') || allContent.includes('digital')) {
      return {
        background: 'F0F4FF', // Light tech blue
        accentColor: '4A90E2', // Tech blue
        titleColor: '0066CC' // Sky blue
      }
    }

    // Health themes
    if (title.includes('health') || title.includes('medical') || title.includes('fitness') ||
        title.includes('wellness') || allContent.includes('health') || allContent.includes('doctor')) {
      return {
        background: 'F0F8F0', // Light mint green
        accentColor: '228B22', // Forest green
        titleColor: '32CD32' // Lime green
      }
    }

    // Education themes
    if (title.includes('education') || title.includes('learning') || title.includes('training') ||
        title.includes('course') || allContent.includes('learn') || allContent.includes('teach')) {
      return {
        background: 'FFF8E1', // Warm light yellow
        accentColor: 'F57C00', // Orange
        titleColor: 'FF9800' // Deep orange
      }
    }

    // Finance themes
    if (title.includes('finance') || title.includes('investment') || title.includes('money') ||
        title.includes('budget') || allContent.includes('finance') || allContent.includes('investment')) {
      return {
        background: 'F5F5F5', // Light grey
        accentColor: '006400', // Dark green (money)
        titleColor: '2E7D32' // Forest green
      }
    }

    // Default professional theme
    return {
      background: 'FFFFFF', // White
      accentColor: '2E7D32', // Green
      titleColor: '1976D2' // Blue
    }
  }

  async generatePPT(presentation: Presentation): Promise<string> {
    const pptx = new PptxGenJS()

    pptx.author = 'AI Assistant'
    pptx.company = 'AI Chat PPT App'
    pptx.title = presentation.title

    const theme = this.detectTheme(presentation)

    if (presentation.slides.length) {
      const slide = pptx.addSlide()
      slide.background = { color: theme.background }
      slide.addText(presentation.title, {
        x: 1,
        y: 1,
        w: 8,
        h: 1.5,
        fontSize: 44,
        bold: true,
        color: theme.titleColor,
        fontFace: 'Arial'
      })
    }

    presentation.slides.forEach((slideData) => {
      if (!slideData.content || !Array.isArray(slideData.content) || slideData.content.length === 0) {
        return
      }

      const firstItem = slideData.content[0]
      const isNewStructure = slideData.content.length > 0 &&
        typeof firstItem === 'object' &&
        firstItem !== null &&
        ('header' in firstItem || 'text' in firstItem)

      const MAX_ITEMS_PER_SLIDE = 5
      const content = slideData.content
      const chunks = []

      for (let i = 0; i < content.length; i += MAX_ITEMS_PER_SLIDE) {
        chunks.push(content.slice(i, i + MAX_ITEMS_PER_SLIDE))
      }

      chunks.forEach((chunk, chunkIndex) => {
        const slide = pptx.addSlide()

        slide.background = { color: theme.background }

        if (slideData.title) {
          const titleText = chunks.length > 1 ? `${slideData.title} (${chunkIndex + 1}/${chunks.length})` : slideData.title
          slide.addText(titleText, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.6,
            fontSize: 32,
            bold: true,
            color: theme.accentColor,
            fontFace: 'Arial'
          })
        }

        if (isNewStructure) {
          let yPosition = 1.5
          chunk.forEach((item: any) => {
            const contentParts = []

            contentParts.push({
              text: '• ',
              options: {}
            })

            if (item.header) {
              contentParts.push({
                text: item.header,
                options: {
                  bold: true,
                  fontSize: 16,
                  color: theme.accentColor
                }
              })
            }

            if (item.text) {
              if (item.header) {
                contentParts.push({
                  text: ' ' + item.text,
                  options: {
                    bold: false,
                    fontSize: 16,
                    color: '424242'
                  }
                })
              } else {
                contentParts.push({
                  text: item.text,
                  options: {
                    bold: false,
                    fontSize: 16,
                    color: '424242'
                  }
                })
              }
            }

            if (contentParts.length > 1) {
              slide.addText(contentParts, {
                x: 0.5,
                y: yPosition,
                w: 9,
                h: 0.8,
                bullet: false,
                align: 'left',
                fontSize: 16,
                lineSpacing: 16
              })

              yPosition += 0.8
            }
          })
        } else if (typeof chunk[0] === 'string') {
          const stringArray = chunk as string[]
          slide.addText(stringArray.map((item: string) => `• ${item}`).join('\n'), {
            x: 0.5,
            y: 1.5,
            w: 9,
            h: 5,
            fontSize: 16,
            bullet: false,
            color: '424242',
            align: 'left'
          })
        }
      })
    })

    const pptxBase64 = await pptx.write({ outputType: 'base64' })
    return pptxBase64 as string
  }
}