import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Loader2, Star, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface STARAnswer {
  situation: string;
  task: string;
  action: string;
  result: string;
}

interface STARQuestion {
  id: number;
  question: string;
  keywords: string[];
  sampleAnswer: STARAnswer;
  category: string;
}

export const STARInterviewPrep = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState<STARQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, STARAnswer>>({});

  const handleGenerateQuestions = async () => {
    if (jobDescription.trim().length < 50) {
      toast.error("Please enter a more detailed job description (at least 50 characters)");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-star-questions", {
        body: { jobDescription },
      });

      if (error) {
        console.error("Error:", error);
        toast.error(error.message || "Failed to generate questions");
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        const initialAnswers: Record<number, STARAnswer> = {};
        data.questions.forEach((q: STARQuestion) => {
          initialAnswers[q.id] = { situation: "", task: "", action: "", result: "" };
        });
        setAnswers(initialAnswers);
        setStarted(true);
        toast.success(`Generated ${data.questions.length} STAR interview questions!`);
      } else {
        toast.error("No questions generated. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (questionId: number, field: keyof STARAnswer, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value
      }
    }));
  };

  const handleReset = () => {
    setStarted(false);
    setJobDescription("");
    setQuestions([]);
    setAnswers({});
  };

  // Job description input screen
  if (!started) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            STAR Interview Preparation
          </h1>
          <p className="mt-2 text-muted-foreground">
            Practice behavioral questions with structured STAR answers
          </p>
        </div>

        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Paste Job Description
            </CardTitle>
            <CardDescription>
              AI will generate behavioral interview questions tailored to the role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here... Include responsibilities, requirements, and qualifications for best results."
              className="min-h-[200px]"
            />
            
            <p className="text-sm text-muted-foreground">
              {jobDescription.length} characters {jobDescription.length < 50 && "(minimum 50 required)"}
            </p>

            <Button 
              onClick={handleGenerateQuestions} 
              disabled={jobDescription.trim().length < 50 || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating STAR Questions...
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  Generate STAR Questions
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Questions and answers screen
  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          STAR Interview Preparation
        </h1>
        <p className="mt-2 text-muted-foreground">
          Answer each question using the STAR method
        </p>
      </div>

      <div className="mx-auto max-w-3xl flex justify-between items-center">
        <Badge variant="secondary">
          {questions.length} Questions
        </Badge>
        <Button variant="outline" onClick={handleReset}>
          New Job Description
        </Button>
      </div>

      <div className="mx-auto max-w-3xl">
        <Card className="mb-4 bg-muted/50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">STAR Method Guide</p>
                <p className="text-muted-foreground mt-1">
                  <strong>S</strong>ituation - Set the context | 
                  <strong> T</strong>ask - Describe your responsibility | 
                  <strong> A</strong>ction - Explain what you did | 
                  <strong> R</strong>esult - Share the outcome
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="space-y-4">
          {questions.map((q, index) => (
            <AccordionItem key={q.id} value={`q-${q.id}`} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex flex-col items-start gap-2 text-left">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{q.category}</Badge>
                    <span className="text-xs text-muted-foreground">Q{index + 1}</span>
                  </div>
                  <span className="font-medium">{q.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4">
                {/* Keywords */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Include these keywords in your answer:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {q.keywords.map((kw, i) => (
                      <Badge key={i} variant="secondary">{kw}</Badge>
                    ))}
                  </div>
                </div>

                {/* Sample Answer Hint */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="py-3">
                    <p className="text-xs font-medium text-primary mb-2">💡 Sample Answer Structure:</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><strong>S:</strong> {q.sampleAnswer.situation}</p>
                      <p><strong>T:</strong> {q.sampleAnswer.task}</p>
                      <p><strong>A:</strong> {q.sampleAnswer.action}</p>
                      <p><strong>R:</strong> {q.sampleAnswer.result}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* STAR Input Fields */}
                <div className="space-y-3">
                  {(["situation", "task", "action", "result"] as const).map((field) => (
                    <div key={field}>
                      <label className="text-sm font-medium capitalize flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {field[0].toUpperCase()}
                        </span>
                        {field}
                      </label>
                      <Textarea
                        value={answers[q.id]?.[field] || ""}
                        onChange={(e) => handleAnswerChange(q.id, field, e.target.value)}
                        placeholder={`Describe the ${field}...`}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
