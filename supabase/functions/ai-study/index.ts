import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  explain: `You are a friendly homework helper tutor for students. When given a question, explain it in a natural, conversational way like a helpful teacher would.

- Write in a friendly, encouraging tone
- Use simple language a 14-year-old can understand
- Avoid overly formal language or excessive formatting
- Don't use numbered sections or bullet points unless absolutely necessary
- Explain step-by-step but keep it conversational
- Include relevant formulas naturally in the explanation
- End with a clear, simple answer
- Keep it under 200 words unless the topic is complex

Think of how you'd explain this to a friend who's confused - be helpful and clear, not like a textbook.`,

  flashcards: `You are a study flashcard generator for students. Given a topic, generate exactly 8 flashcards.
Return a JSON object with a 'cards' array. Each card has 'front' and 'back' fields.
Make the flashcards conversational and natural - avoid overly formal language.`,

  quiz: `You are a quiz generator for students. Given a topic, generate exactly 5 multiple-choice questions.
Return a JSON object with a 'questions' array. Each question has 'question', 'options' (array of 4 strings), 'answer' (0-3 index), and 'explanation' fields.
Write questions in a natural, conversational style that students would actually encounter.`,

  formula: `You are a helpful formula finder for students. Given a natural language query, find and explain the most relevant formula.

- Explain in a friendly, conversational way
- Don't use numbered lists or bullet points
- Write as if you're explaining to a classmate
- Keep it simple and clear
- Include a practical example
- Avoid overly academic language

Just explain what the formula is, what the variables mean, and how to use it in a natural way.`,
};


serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, prompt } = await req.json();

    if (!type || !prompt) {
      return new Response(
        JSON.stringify({ error: "Missing type or prompt" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[type];
    if (!systemPrompt) {
      return new Response(
        JSON.stringify({ error: "Invalid type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    // Convert to Gemini API format with native system instructions and JSON mode if needed
    const body: any = {
      contents: [
        { role: "user", parts: [{ text: prompt }] },
      ],
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    // Use JSON mode for structured types
    if (type === "flashcards" || type === "quiz") {
      body.generationConfig.response_mime_type = "application/json";

      if (type === "flashcards") {
        body.generationConfig.response_schema = {
          type: "object",
          properties: {
            cards: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  front: { type: "string" },
                  back: { type: "string" },
                },
                required: ["front", "back"],
              },
            },
          },
          required: ["cards"],
        };
      } else if (type === "quiz") {
        body.generationConfig.response_schema = {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 4,
                    maxItems: 4,
                  },
                  answer: { type: "number" },
                  explanation: { type: "string" },
                },
                required: ["question", "options", "answer", "explanation"],
              },
            },
          },
          required: ["questions"],
        };
      }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    
    if (!candidate) {
      console.error("No response from Gemini:", data);
      return new Response(
        JSON.stringify({ error: "No AI response generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const content = candidate.content?.parts?.[0]?.text || "";
    let result: any;

    if (type === "flashcards" || type === "quiz") {
      try {
        result = JSON.parse(content);
      } catch (e) {
        console.error("Failed to parse Gemini JSON response:", content, e);
        // Fallback to regex if Gemini didn't return pure JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          result = { text: content };
        }
      }
    } else {
      result = { text: content || "No response generated." };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-study error:", e);
    const msg = e instanceof Error && e.name === "AbortError"
      ? "Request timed out. Please try again."
      : e instanceof Error ? e.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
