/**
 * Gemini Flash 2.5 API integration for AI image detection
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

// API key loaded from .env (VITE_GEMINI_API_KEY)
export const ENV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

const ANALYSIS_PROMPT = `You are an expert forensic image analyst specializing in detecting AI-generated images and photo manipulation. 

Analyze the provided image carefully and determine:
1. Is it AI-generated (created entirely by AI tools like Midjourney, DALL-E, Stable Diffusion, etc.)?
2. Is it a real photo that has been modified/manipulated (edited with Photoshop, deepfake, inpainting, etc.)?
3. Is it an authentic, unmodified photograph?

Look for these indicators:
- AI generation: Unnatural skin textures, distorted hands/fingers, inconsistent lighting physics, watermarks, perfect symmetry, dreamlike quality, artifacts at edges
- Manipulation: Inconsistent lighting/shadows, cloning artifacts, unnatural blending, metadata anomalies, inconsistent noise patterns, deepfake facial artifacts
- Authentic: Natural noise patterns, consistent lighting, realistic imperfections, natural depth of field

Respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "verdict": "AI-Generated" | "Modified/Manipulated" | "Authentic",
  "confidence": "85%",
  "analysis": "A detailed 2-3 sentence explanation of your findings.",
  "indicators": [
    "Key indicator 1",
    "Key indicator 2",
    "Key indicator 3"
  ]
}`

/**
 * Convert a File object to base64
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result.split(',')[1]
            resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

/**
 * Analyze an image using Gemini Flash 2.5
 * @param {File} imageFile - The image file to analyze
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<{verdict: string, confidence: string, analysis: string, indicators: string[]}>}
 */
export async function analyzeImageWithGemini(imageFile, apiKey) {
    const base64Image = await fileToBase64(imageFile)
    const mimeType = imageFile.type || 'image/jpeg'

    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: ANALYSIS_PROMPT
                    },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Image
                        }
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.1,
            topP: 0.95,
            maxOutputTokens: 1024,
            responseMimeType: 'application/json'
        }
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData?.error?.message || `API Error: ${response.status} ${response.statusText}`

        console.error('[TrustLens] API Error:', response.status, errorMessage)
        console.info('[TrustLens] Key used (first 8 chars):', apiKey?.substring(0, 8))

        if (response.status === 400) {
            throw new Error(`Invalid request: ${errorMessage}`)
        } else if (response.status === 403) {
            throw new Error(`Unauthorized: ${errorMessage}. Please check your Gemini API key.`)
        } else if (response.status === 429) {
            throw new Error(`Rate limit exceeded: ${errorMessage}. Wait a moment and try again, or check your API quota at aistudio.google.com.`)
        } else {
            throw new Error(`${response.status}: ${errorMessage}`)
        }
    }

    const data = await response.json()

    // Extract the text response
    const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!textContent) {
        throw new Error('No response received from Gemini API.')
    }

    // Parse JSON response
    try {
        const parsed = JSON.parse(textContent)
        return {
            verdict: parsed.verdict || 'Unknown',
            confidence: parsed.confidence || 'N/A',
            analysis: parsed.analysis || 'No analysis available.',
            indicators: Array.isArray(parsed.indicators) ? parsed.indicators : []
        }
    } catch {
        // Fallback: try to extract from text
        return {
            verdict: 'Analysis Complete',
            confidence: 'N/A',
            analysis: textContent,
            indicators: []
        }
    }
}
