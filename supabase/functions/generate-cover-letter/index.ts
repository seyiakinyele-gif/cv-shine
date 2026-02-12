import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { cvContent, jobDescription } = await req.json();

    if (!cvContent || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "CV content and job description are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert cover letter writer based in the UK. You MUST use British English spelling throughout ALL of your output — every single word. This is critical and non-negotiable.

British English examples you MUST follow:
- "optimise" NOT "optimize", "organisation" NOT "organization", "behaviour" NOT "behavior"
- "analyse" NOT "analyze", "specialise" NOT "specialize", "recognise" NOT "recognize"
- "colour" NOT "color", "honour" NOT "honor", "favour" NOT "favor"
- "centre" NOT "center", "metre" NOT "meter", "fibre" NOT "fiber"
- "programme" NOT "program" (except computer program), "catalogue" NOT "catalog"
- "defence" NOT "defense", "licence" (noun) NOT "license", "practise" (verb) NOT "practice"
- "travelling" NOT "traveling", "modelling" NOT "modeling", "labelling" NOT "labeling"
- "fulfilment" NOT "fulfillment", "enrolment" NOT "enrollment", "skilful" NOT "skillful"

Guidelines:
- Keep it to 3-4 paragraphs plus opening/closing
- Opening: Address "Dear Hiring Manager" unless a specific name is found in the job description
- Paragraph 1: Express enthusiasm for the specific role and organisation, mention how you found it
- Paragraph 2-3: Highlight the most relevant experience and achievements from the CV that directly map to the job requirements. Use specific examples and quantifiable results
- Closing paragraph: Reiterate interest, mention availability for interview, and thank them
- Sign off with "Yours faithfully" (if Dear Hiring Manager) or "Yours sincerely" (if named)
- Tone: Professional yet personable, confident but not arrogant
- Naturally weave in key requirements from the job description
- Do NOT simply repeat the CV — tell a narrative that connects experience to the role

Return ONLY the cover letter text, no additional commentary or formatting markers.`;

    const userPrompt = `Write a tailored cover letter for this candidate applying to this role.

=== CANDIDATE'S CV ===
${cvContent}

=== JOB DESCRIPTION ===
${jobDescription}

Write the cover letter now.`;

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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to generate cover letter" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "No response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clean any markdown wrappers
    let coverLetter = content.trim();
    const mdMatch = coverLetter.match(/```(?:\w+)?\s*([\s\S]*?)```/);
    if (mdMatch) {
      coverLetter = mdMatch[1].trim();
    }

    return new Response(
      JSON.stringify({ coverLetter }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-cover-letter:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
