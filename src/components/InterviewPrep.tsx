import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ChevronRight, RotateCcw, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  category: string;
}

const questionBank: Question[] = [
  {
    id: 1,
    question: "What does 'KPI' stand for in a business context?",
    options: [
      { label: "A", text: "Key Performance Indicator" },
      { label: "B", text: "Knowledge Process Integration" },
      { label: "C", text: "Key Project Initiative" },
      { label: "D", text: "Knowledge Performance Index" },
    ],
    correctAnswer: "A",
    explanation: "KPI stands for Key Performance Indicator - a measurable value that demonstrates how effectively a company is achieving key business objectives.",
    category: "Business Terminology",
  },
  {
    id: 2,
    question: "In project management, what does 'Agile' primarily refer to?",
    options: [
      { label: "A", text: "A strict waterfall methodology" },
      { label: "B", text: "An iterative approach to project delivery" },
      { label: "C", text: "A type of project budget" },
      { label: "D", text: "A risk assessment tool" },
    ],
    correctAnswer: "B",
    explanation: "Agile is an iterative approach to project management that helps teams deliver value faster with fewer headaches through short development cycles called sprints.",
    category: "Project Management",
  },
  {
    id: 3,
    question: "What is 'ROI' used to measure?",
    options: [
      { label: "A", text: "Employee satisfaction" },
      { label: "B", text: "Return on Investment" },
      { label: "C", text: "Rate of Inflation" },
      { label: "D", text: "Risk of Implementation" },
    ],
    correctAnswer: "B",
    explanation: "ROI (Return on Investment) is a performance measure used to evaluate the efficiency of an investment or compare the efficiency of several investments.",
    category: "Finance",
  },
  {
    id: 4,
    question: "What does 'B2B' mean in a sales context?",
    options: [
      { label: "A", text: "Back to Business" },
      { label: "B", text: "Business to Business" },
      { label: "C", text: "Budget to Budget" },
      { label: "D", text: "Brand to Brand" },
    ],
    correctAnswer: "B",
    explanation: "B2B (Business to Business) refers to commerce transactions between businesses, such as between a manufacturer and a wholesaler.",
    category: "Sales & Marketing",
  },
  {
    id: 5,
    question: "What is a 'stakeholder' in project management?",
    options: [
      { label: "A", text: "Only the project manager" },
      { label: "B", text: "Anyone with an interest in the project's outcome" },
      { label: "C", text: "The company shareholders only" },
      { label: "D", text: "External consultants" },
    ],
    correctAnswer: "B",
    explanation: "A stakeholder is anyone who has an interest in or is affected by a project - this includes team members, customers, sponsors, and end users.",
    category: "Project Management",
  },
  {
    id: 6,
    question: "What does 'SLA' stand for in service delivery?",
    options: [
      { label: "A", text: "Service Level Agreement" },
      { label: "B", text: "Standard Legal Arrangement" },
      { label: "C", text: "System Login Access" },
      { label: "D", text: "Software License Agreement" },
    ],
    correctAnswer: "A",
    explanation: "SLA (Service Level Agreement) is a commitment between a service provider and a client defining the level of service expected.",
    category: "Business Terminology",
  },
  {
    id: 7,
    question: "In HR, what does 'onboarding' refer to?",
    options: [
      { label: "A", text: "Firing employees" },
      { label: "B", text: "The process of integrating new employees" },
      { label: "C", text: "Annual performance reviews" },
      { label: "D", text: "Exit interviews" },
    ],
    correctAnswer: "B",
    explanation: "Onboarding is the process of integrating new employees into an organisation, including training, orientation, and cultural assimilation.",
    category: "Human Resources",
  },
  {
    id: 8,
    question: "What is 'scalability' in a business context?",
    options: [
      { label: "A", text: "The weight of products" },
      { label: "B", text: "The ability to grow without being hampered by structure" },
      { label: "C", text: "A type of pricing model" },
      { label: "D", text: "Employee ranking system" },
    ],
    correctAnswer: "B",
    explanation: "Scalability refers to a company's ability to grow and manage increased demand without compromising performance or losing revenue potential.",
    category: "Business Strategy",
  },
  {
    id: 9,
    question: "What does 'CRM' stand for?",
    options: [
      { label: "A", text: "Customer Retention Method" },
      { label: "B", text: "Corporate Risk Management" },
      { label: "C", text: "Customer Relationship Management" },
      { label: "D", text: "Client Revenue Model" },
    ],
    correctAnswer: "C",
    explanation: "CRM (Customer Relationship Management) is a technology for managing all your company's relationships and interactions with customers and potential customers.",
    category: "Sales & Marketing",
  },
  {
    id: 10,
    question: "What is a 'deliverable' in project terms?",
    options: [
      { label: "A", text: "A shipping method" },
      { label: "B", text: "A tangible or intangible output produced as a result of project work" },
      { label: "C", text: "The project deadline" },
      { label: "D", text: "The project budget" },
    ],
    correctAnswer: "B",
    explanation: "A deliverable is any tangible or intangible product or service produced as a result of a project that is intended to be delivered to a customer.",
    category: "Project Management",
  },
];

export const InterviewPrep = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const currentQuestion = questionBank[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    setShowResult(true);
    if (isCorrect && !answeredQuestions.includes(currentQuestion.id)) {
      setScore(score + 1);
    }
    setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionBank.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
  };

  if (quizComplete) {
    const percentage = Math.round((score / questionBank.length) * 100);
    return (
      <div className="animate-fade-in space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Interview Preparation
          </h1>
          <p className="mt-2 text-muted-foreground">
            Test your knowledge of common business terminology
          </p>
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
                You got {score} out of {questionBank.length} questions correct
              </p>
            </div>
            
            <div className="rounded-lg bg-muted p-4">
              {percentage >= 80 ? (
                <p className="text-center text-foreground">
                  🎉 Excellent! You have a strong grasp of business terminology.
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

            <Button onClick={handleRestartQuiz} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Interview Preparation
        </h1>
        <p className="mt-2 text-muted-foreground">
          Test your knowledge of common business terminology
        </p>
      </div>

      {/* Progress */}
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <Badge variant="secondary">
          <BookOpen className="mr-1.5 h-3 w-3" />
          {currentQuestion.category}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questionBank.length}
        </span>
      </div>

      {/* Question Card */}
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            disabled={showResult}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div
                key={option.label}
                className={cn(
                  "flex items-center space-x-3 rounded-lg border p-4 transition-colors",
                  showResult && option.label === currentQuestion.correctAnswer && "border-green-500 bg-green-50 dark:bg-green-950/20",
                  showResult && selectedAnswer === option.label && option.label !== currentQuestion.correctAnswer && "border-red-500 bg-red-50 dark:bg-red-950/20",
                  !showResult && selectedAnswer === option.label && "border-primary bg-primary/5"
                )}
              >
                <RadioGroupItem value={option.label} id={option.label} />
                <Label
                  htmlFor={option.label}
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

          {showResult && (
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
                {currentQuestionIndex < questionBank.length - 1 ? (
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

      {/* Score Tracker */}
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-center gap-1">
          {questionBank.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 w-2 rounded-full",
                index < currentQuestionIndex
                  ? answeredQuestions.includes(questionBank[index].id) &&
                    "bg-primary"
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
