import { QuizCategory, QuizData } from '../types';

export interface QuizServiceResult {
  success: boolean;
  quiz?: QuizData;
  error?: string;
}

export async function fetchQuiz(
  location: string,
  category: QuizCategory
): Promise<QuizServiceResult> {
  const cleanLocation = location.trim();

  if (!cleanLocation) {
    return {
      success: false,
      error: 'Location name is required to start the quiz.',
    };
  }

  try {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: cleanLocation,
        category,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success || !data.quiz) {
      return {
        success: false,
        error:
          data.error ||
          `Unable to generate quiz (HTTP ${res.status}: ${res.statusText})`,
      };
    }

    // Verify 3 questions exist
    if (!data.quiz.questions || data.quiz.questions.length === 0) {
      return {
        success: false,
        error: 'The AI model generated an incomplete quiz. Please try again.',
      };
    }

    return {
      success: true,
      quiz: data.quiz,
    };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error
        ? err.message
        : 'Network error connecting to the quiz server.';
    return {
      success: false,
      error: errorMsg,
    };
  }
}
