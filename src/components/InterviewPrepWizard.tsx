import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ChevronRight, RotateCcw, BookOpen, Loader2 } from "lucide-react";
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

interface InterviewPrepWizardProps {
  jobDescription: string;
  onComplete: () => void;
}

export const InterviewPrepWizard = ({ jobDescription, onComplete }: InterviewPrepWizardProps) => {
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
      toast.error("Job description too short for quiz generation");
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
      onComplete();
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
  };

  // Start screen
  if (!quizStarted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Interview Quiz
          </h2>
          <p className="mt-2 text-muted-foreground">
            Test your knowledge with questions tailored to this role
          </p>
        </div>

        <Card className="mx-auto max-w-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <BookOpen className="h-5 w-5" />
              Ready to Test Your Knowledge?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              AI will generate role-specific questions based on the job description you provided.
            </p>
            <Button 
              onClick={handleGenerateQuestions} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                "Start Quiz"
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
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Quiz Complete!
          </h2>
        </div>

        <Card className="mx-auto max-w-xl">
          <CardContent className="py-8 space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{percentage}%</div>
              <p className="mt-2 text-muted-foreground">
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

            <Button onClick={handleRetry} variant="outline" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">
          <BookOpen className="mr-1.5 h-3 w-3" />
          {currentQuestion?.category}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      <Card>
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

          {!showResult ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="w-full"
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="w-full">
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
        </CardContent>
      </Card>

      {/* Progress dots */}
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
  );
};
