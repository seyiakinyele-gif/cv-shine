import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobDescription } = await req.json();

    if (!jobDescription || jobDescription.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: "Please provide a detailed job description (at least 50 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert career coach and interview preparation specialist. Based on the job description provided, generate exactly 30 multiple-choice interview questions that test understanding of key terminology, concepts, and skills mentioned in the job description.

Each question should:
- Test knowledge of specific terms, tools, concepts, or skills from the job description
- Have 4 options (A, B, C, D) with only one correct answer
- Include a brief explanation of why the correct answer is right
- Be relevant to someone preparing for an interview for this specific role`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate interview questions based on this job description:\n\n${jobDescription}` },
        ],
        temperature: 0.7,
        tools: [
          {
            type: "function",
            function: {
              name: "generate_questions",
              description: "Generate multiple-choice interview questions",
              parameters: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        question: { type: "string" },
                        options: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              label: { type: "string" },
                              text: { type: "string" }
                            },
                            required: ["label", "text"]
                          }
                        },
                        correctAnswer: { type: "string" },
                        explanation: { type: "string" },
                        category: { type: "string" }
                      },
                      required: ["id", "question", "options", "correctAnswer", "explanation", "category"]
                    }
                  }
                },
                required: ["questions"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_questions" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate questions" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    
    // Extract questions from tool call response
    let questions;
    const toolCalls = data.choices?.[0]?.message?.tool_calls;
    
    if (toolCalls && toolCalls.length > 0) {
      try {
        const args = JSON.parse(toolCalls[0].function.arguments);
        questions = args.questions;
      } catch (parseError) {
        console.error("Failed to parse tool call arguments:", parseError);
        return new Response(
          JSON.stringify({ error: "Failed to parse generated questions" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      // Fallback to content parsing if tool calls not present
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        console.error("No content or tool calls in AI response:", JSON.stringify(data));
        return new Response(
          JSON.stringify({ error: "Failed to generate questions" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      try {
        const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        questions = JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        return new Response(
          JSON.stringify({ error: "Failed to parse generated questions" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate structure
    if (!Array.isArray(questions) || questions.length === 0) {
      console.error("Invalid questions structure:", questions);
      return new Response(
        JSON.stringify({ error: "Invalid questions format" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generated ${questions.length} questions successfully`);

    return new Response(
      JSON.stringify({ questions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating questions:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
