import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, ChevronRight, RotateCcw, BookOpen, Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  category: string;
}

export const InterviewPrep = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = currentQuestion && selectedAnswer === currentQuestion.correctAnswer;

  const handleGenerateQuestions = async () => {
    if (jobDescription.trim().length < 50) {
      toast.error("Please enter a more detailed job description (at least 50 characters)");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-interview-questions", {
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
        setQuizStarted(true);
        toast.success(`Generated ${data.questions.length} interview questions!`);
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

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;
    
    setShowResult(true);
    if (isCorrect && !answeredQuestions.includes(currentQuestion.id)) {
      setScore(score + 1);
    }
    setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setJobDescription("");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
  };

  const handleRetryWithSameJob = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
  };

  // Job description input screen
  if (!quizStarted) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Interview Preparation
          </h1>
          <p className="mt-2 text-muted-foreground">
            Paste a job description to get tailored interview questions
          </p>
        </div>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Paste Job Description
            </CardTitle>
            <CardDescription>
              AI will generate relevant interview questions based on the role
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
                  Generating Questions...
                </>
              ) : (
                "Generate Interview Questions"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz complete screen
  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="animate-fade-in space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Interview Preparation
          </h1>
          <p className="mt-2 text-muted-foreground">Quiz Complete</p>
        </div>

        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <CardDescription>Here's how you performed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary">{percentage}%</div>
              <p className="mt-2 text-lg text-muted-foreground">
                You got {score} out of {questions.length} questions correct
              </p>
            </div>
            
            <div className="rounded-lg bg-muted p-4">
              {percentage >= 80 ? (
                <p className="text-center text-foreground">
                  🎉 Excellent! You're well-prepared for this role's interview.
                </p>
              ) : percentage >= 60 ? (
                <p className="text-center text-foreground">
                  👍 Good effort! Review the explanations to strengthen your knowledge.
                </p>
              ) : (
                <p className="text-center text-foreground">
                  📚 Keep practising! Understanding these terms will boost your interview confidence.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleRetryWithSameJob} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry Quiz
              </Button>
              <Button onClick={handleRestartQuiz} className="flex-1">
                New Job Description
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Interview Preparation
        </h1>
        <p className="mt-2 text-muted-foreground">
          Test your knowledge for this role
        </p>
      </div>

      {/* Progress */}
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <Badge variant="secondary">
          <BookOpen className="mr-1.5 h-3 w-3" />
          {currentQuestion?.category}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Question Card */}
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {currentQuestion?.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            disabled={showResult}
            className="space-y-3"
          >
            {currentQuestion?.options.map((option) => (
              <div
                key={option.label}
                className={cn(
                  "flex items-center space-x-3 rounded-lg border p-4 transition-colors",
                  showResult && option.label === currentQuestion.correctAnswer && "border-green-500 bg-green-50 dark:bg-green-950/20",
                  showResult && selectedAnswer === option.label && option.label !== currentQuestion.correctAnswer && "border-red-500 bg-red-50 dark:bg-red-950/20",
                  !showResult && selectedAnswer === option.label && "border-primary bg-primary/5"
                )}
              >
                <RadioGroupItem value={option.label} id={`q${currentQuestionIndex}-${option.label}`} />
                <Label
                  htmlFor={`q${currentQuestionIndex}-${option.label}`}
                  className="flex-1 cursor-pointer text-sm font-medium"
                >
                  <span className="mr-2 font-semibold">{option.label}.</span>
                  {option.text}
                </Label>
                {showResult && option.label === currentQuestion.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {showResult && selectedAnswer === option.label && option.label !== currentQuestion.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </RadioGroup>

          {showResult && currentQuestion && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium text-foreground">Explanation:</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            {!showResult ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="flex-1"
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="flex-1">
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "View Results"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress dots */}
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-center gap-1 flex-wrap">
          {questions.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 w-2 rounded-full",
                index < currentQuestionIndex
                  ? "bg-primary"
                  : index === currentQuestionIndex
                  ? "bg-primary"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
