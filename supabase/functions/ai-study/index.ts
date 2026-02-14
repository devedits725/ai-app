import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  explain: `You are a friendly tutor for school students. When given a homework question:
1. Identify the subject and topic
2. Explain step-by-step in simple language a 14-year-old can understand
3. Show any relevant formulas
4. Give the final answer
Keep it concise but thorough. Use bullet points and numbered steps.`,

  flashcards: `You are a flashcard generator for students. Given a topic, generate exactly 8 flashcards.
You MUST respond using the generate_flashcards tool.`,

  quiz: `You are a quiz generator for students. Given a topic, generate exactly 5 multiple-choice questions.
You MUST respond using the generate_quiz tool.`,

  formula: `You are a formula search engine for students. Given a natural language query, find the most relevant formula.
Respond with:
1. The formula name
2. The formula itself
3. What each variable means
4. A brief example of how to use it
Keep it concise and student-friendly.`,
};

const TOOLS: Record<string, any[]> = {
  flashcards: [
    {
      type: "function",
      function: {
        name: "generate_flashcards",
        description: "Generate 8 study flashcards on the given topic",
        parameters: {
          type: "object",
          properties: {
            cards: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  front: { type: "string", description: "Question or term" },
                  back: { type: "string", description: "Answer or definition" },
                },
                required: ["front", "back"],
                additionalProperties: false,
              },
            },
          },
          required: ["cards"],
          additionalProperties: false,
        },
      },
    },
  ],
  quiz: [
    {
      type: "function",
      function: {
        name: "generate_quiz",
        description: "Generate 5 MCQ questions with options and explanations",
        parameters: {
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
                    description: "Exactly 4 options",
                  },
                  answer: {
                    type: "number",
                    description: "Index of correct option (0-3)",
                  },
                  explanation: { type: "string" },
                },
                required: ["question", "options", "answer", "explanation"],
                additionalProperties: false,
              },
            },
          },
          required: ["questions"],
          additionalProperties: false,
        },
      },
    },
  ],
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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const body: any = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    };

    // Use tool calling for structured output
    if (TOOLS[type]) {
      body.tools = TOOLS[type];
      body.tool_choice = {
        type: "function",
        function: { name: TOOLS[type][0].function.name },
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
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
    const choice = data.choices?.[0];

    let result: any;

    if (choice?.message?.tool_calls?.length) {
      // Structured output via tool calling
      const toolCall = choice.message.tool_calls[0];
      result = JSON.parse(toolCall.function.arguments);
    } else {
      // Plain text response
      result = { text: choice?.message?.content || "No response generated." };
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
