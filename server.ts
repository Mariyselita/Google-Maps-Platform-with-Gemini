import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Google GenAI with recommended telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint for Gemini Local Insights
app.post('/api/insights', async (req, res) => {
  try {
    const { location } = req.body;

    if (!location || typeof location !== 'string' || !location.trim()) {
      return res.status(400).json({ error: 'Location string is required.' });
    }

    const cleanLocation = location.trim();
    // Prompt template specified in user requirements
    const prompt = `You are a local tour guide for ${cleanLocation}. Give me exactly 3 short, highly engaging, and unusual or surprising fun facts about this place. Keep each fact under 2 sentences. Format the response as a clean HTML unordered list (<ul>) so I can inject it directly.`;

    let response;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        break;
      } catch (err: any) {
        if (attempt < 2 && (err?.status === 503 || err?.status === 429 || String(err).includes('503'))) {
          await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
          continue;
        }
        throw err;
      }
    }

    let html = response?.text || '';

    // Clean up potential markdown code fences (e.g., ```html ... ```)
    html = html
      .replace(/^```(?:html)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // Verify response contains a list
    if (!html.includes('<ul') && !html.includes('<li')) {
      html = `<ul class="space-y-2"><li>${html}</li></ul>`;
    }

    return res.json({
      success: true,
      location: cleanLocation,
      html,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error in /api/insights:', errorMsg);

    return res.status(500).json({
      success: false,
      error: 'Unable to retrieve local insights from Gemini AI.',
      details: errorMsg,
    });
  }
});

// API endpoint for Gemini 3-Question Quiz
app.post('/api/quiz', async (req, res) => {
  try {
    const { location, category } = req.body;

    if (!location || typeof location !== 'string' || !location.trim()) {
      return res.status(400).json({ error: 'Location string is required.' });
    }

    const validCategories = ['Local cuisine', 'Art and culture', 'Local history'];
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({
        error: 'Valid category is required (Local cuisine, Art and culture, or Local history).',
      });
    }

    const cleanLocation = location.trim();
    const prompt = `You are an entertaining game host and local guide for ${cleanLocation}. Generate an engaging, high-quality 3-question multiple choice trivia quiz about ${cleanLocation} focusing strictly on the category: "${category}".

Requirements:
- Exactly 3 questions.
- Each question must have 4 distinct, plausible multiple-choice options.
- Exactly one correct answer with its zero-based index (0, 1, 2, or 3).
- Provide a concise 1-2 sentence explanation of why that answer is correct, highlighting a fascinating detail about ${cleanLocation}.`;

    let response;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                location: { type: Type.STRING },
                category: { type: Type.STRING },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.INTEGER },
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      correctAnswerIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                    },
                    required: ['id', 'question', 'options', 'correctAnswerIndex', 'explanation'],
                  },
                },
              },
              required: ['location', 'category', 'questions'],
            },
          },
        });
        break;
      } catch (err: any) {
        if (attempt < 2 && (err?.status === 503 || err?.status === 429 || String(err).includes('503'))) {
          await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
          continue;
        }
        throw err;
      }
    }

    const jsonText = response?.text || '{}';
    const parsed = JSON.parse(jsonText);

    return res.json({
      success: true,
      quiz: {
        location: parsed.location || cleanLocation,
        category: parsed.category || category,
        questions: parsed.questions || [],
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error in /api/quiz:', errorMsg);

    return res.status(500).json({
      success: false,
      error: 'Failed to generate quiz with Gemini AI. Please try again.',
      details: errorMsg,
    });
  }
});


// Set up dev/prod server mounting
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Block Explorer server listening on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
