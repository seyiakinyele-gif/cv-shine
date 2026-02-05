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
  {
    id: 11,
    question: "What does 'SWOT' analysis examine?",
    options: [
      { label: "A", text: "Sales, Wages, Operations, Taxes" },
      { label: "B", text: "Strengths, Weaknesses, Opportunities, Threats" },
      { label: "C", text: "Systems, Workflows, Outputs, Timelines" },
      { label: "D", text: "Strategy, Work, Organisation, Training" },
    ],
    correctAnswer: "B",
    explanation: "SWOT analysis is a strategic planning technique that identifies Strengths, Weaknesses, Opportunities, and Threats related to business competition or project planning.",
    category: "Business Strategy",
  },
  {
    id: 12,
    question: "What is 'B2C' in marketing?",
    options: [
      { label: "A", text: "Business to Customer" },
      { label: "B", text: "Brand to Company" },
      { label: "C", text: "Budget to Cost" },
      { label: "D", text: "Business to Consumer" },
    ],
    correctAnswer: "D",
    explanation: "B2C (Business to Consumer) refers to the process of selling products and services directly to consumers who are the end-users.",
    category: "Sales & Marketing",
  },
  {
    id: 13,
    question: "What does 'ERP' stand for?",
    options: [
      { label: "A", text: "Employee Resource Planning" },
      { label: "B", text: "Enterprise Resource Planning" },
      { label: "C", text: "External Review Process" },
      { label: "D", text: "Efficient Revenue Production" },
    ],
    correctAnswer: "B",
    explanation: "ERP (Enterprise Resource Planning) is software that organisations use to manage day-to-day business activities such as accounting, procurement, and project management.",
    category: "Technology",
  },
  {
    id: 14,
    question: "What is 'scope creep' in project management?",
    options: [
      { label: "A", text: "A type of project software" },
      { label: "B", text: "Uncontrolled expansion of project scope" },
      { label: "C", text: "A team meeting format" },
      { label: "D", text: "Budget reduction technique" },
    ],
    correctAnswer: "B",
    explanation: "Scope creep refers to the uncontrolled expansion of project scope without adjustments to time, cost, and resources, often leading to project delays and budget overruns.",
    category: "Project Management",
  },
  {
    id: 15,
    question: "What does 'MVP' mean in product development?",
    options: [
      { label: "A", text: "Most Valuable Player" },
      { label: "B", text: "Minimum Viable Product" },
      { label: "C", text: "Maximum Value Proposition" },
      { label: "D", text: "Marketing Value Point" },
    ],
    correctAnswer: "B",
    explanation: "MVP (Minimum Viable Product) is a development technique where a new product is introduced with basic features to satisfy early adopters and gather feedback for future development.",
    category: "Product Development",
  },
  {
    id: 16,
    question: "What is 'due diligence' in business?",
    options: [
      { label: "A", text: "Meeting deadlines" },
      { label: "B", text: "Comprehensive appraisal before a transaction" },
      { label: "C", text: "Employee punctuality" },
      { label: "D", text: "Legal compliance only" },
    ],
    correctAnswer: "B",
    explanation: "Due diligence is a comprehensive appraisal of a business or individual prior to signing a contract, or an act with a certain standard of care.",
    category: "Finance",
  },
  {
    id: 17,
    question: "What does 'EOD' typically mean in workplace communication?",
    options: [
      { label: "A", text: "End of Discussion" },
      { label: "B", text: "End of Day" },
      { label: "C", text: "Execution of Duties" },
      { label: "D", text: "Evaluation of Data" },
    ],
    correctAnswer: "B",
    explanation: "EOD (End of Day) is commonly used to indicate a deadline, typically meaning by the close of business on that day.",
    category: "Business Terminology",
  },
  {
    id: 18,
    question: "What is 'benchmarking' in business?",
    options: [
      { label: "A", text: "Setting up office furniture" },
      { label: "B", text: "Comparing performance against industry standards" },
      { label: "C", text: "Creating employee schedules" },
      { label: "D", text: "Testing software speed" },
    ],
    correctAnswer: "B",
    explanation: "Benchmarking is the practice of comparing business processes and performance metrics to industry bests and best practices from other companies.",
    category: "Business Strategy",
  },
  {
    id: 19,
    question: "What does 'NDA' stand for?",
    options: [
      { label: "A", text: "New Deal Agreement" },
      { label: "B", text: "National Development Agency" },
      { label: "C", text: "Non-Disclosure Agreement" },
      { label: "D", text: "No Data Available" },
    ],
    correctAnswer: "C",
    explanation: "NDA (Non-Disclosure Agreement) is a legal contract establishing a confidential relationship between parties to protect sensitive information.",
    category: "Legal",
  },
  {
    id: 20,
    question: "What is 'pipeline' in sales terminology?",
    options: [
      { label: "A", text: "Oil transportation system" },
      { label: "B", text: "The stages a prospect goes through to become a customer" },
      { label: "C", text: "Communication channels" },
      { label: "D", text: "Data transfer method" },
    ],
    correctAnswer: "B",
    explanation: "A sales pipeline is a visual representation of where prospects are in the sales process, from initial contact to closing the deal.",
    category: "Sales & Marketing",
  },
  {
    id: 21,
    question: "What does 'P&L' refer to in finance?",
    options: [
      { label: "A", text: "Planning and Logistics" },
      { label: "B", text: "Profit and Loss" },
      { label: "C", text: "Performance and Learning" },
      { label: "D", text: "Products and Licensing" },
    ],
    correctAnswer: "B",
    explanation: "P&L (Profit and Loss) statement is a financial report that summarises revenues, costs, and expenses incurred during a specific period.",
    category: "Finance",
  },
  {
    id: 22,
    question: "What is 'churn rate' in business metrics?",
    options: [
      { label: "A", text: "Employee productivity measure" },
      { label: "B", text: "Rate at which customers stop doing business with a company" },
      { label: "C", text: "Manufacturing speed" },
      { label: "D", text: "Inventory turnover" },
    ],
    correctAnswer: "B",
    explanation: "Churn rate is the percentage of customers who stop using a company's product or service during a given time period.",
    category: "Business Metrics",
  },
  {
    id: 23,
    question: "What does 'API' stand for in technology?",
    options: [
      { label: "A", text: "Automated Process Integration" },
      { label: "B", text: "Application Programming Interface" },
      { label: "C", text: "Advanced Product Information" },
      { label: "D", text: "Analytical Performance Index" },
    ],
    correctAnswer: "B",
    explanation: "API (Application Programming Interface) is a set of protocols and tools for building software applications that allows different systems to communicate.",
    category: "Technology",
  },
  {
    id: 24,
    question: "What is 'synergy' in a business context?",
    options: [
      { label: "A", text: "A type of energy source" },
      { label: "B", text: "Combined effect greater than individual effects" },
      { label: "C", text: "Employee collaboration tool" },
      { label: "D", text: "Market competition" },
    ],
    correctAnswer: "B",
    explanation: "Synergy refers to the concept that the combined value and performance of two companies will be greater than the sum of the separate individual parts.",
    category: "Business Strategy",
  },
  {
    id: 25,
    question: "What does 'OKR' stand for?",
    options: [
      { label: "A", text: "Operational Knowledge Review" },
      { label: "B", text: "Objectives and Key Results" },
      { label: "C", text: "Organisational Key Resources" },
      { label: "D", text: "Output and Knowledge Ratio" },
    ],
    correctAnswer: "B",
    explanation: "OKR (Objectives and Key Results) is a goal-setting framework used by teams and individuals to define measurable goals and track their outcomes.",
    category: "Project Management",
  },
  {
    id: 26,
    question: "What is 'fiscal year' in accounting?",
    options: [
      { label: "A", text: "The calendar year" },
      { label: "B", text: "A 12-month period used for financial reporting" },
      { label: "C", text: "The tax deadline" },
      { label: "D", text: "Quarterly earnings period" },
    ],
    correctAnswer: "B",
    explanation: "A fiscal year is a 12-month period that a company uses for accounting purposes and preparing financial statements, which may differ from the calendar year.",
    category: "Finance",
  },
  {
    id: 27,
    question: "What does 'bandwidth' mean in a workplace context?",
    options: [
      { label: "A", text: "Internet connection speed" },
      { label: "B", text: "Available capacity or resources to handle tasks" },
      { label: "C", text: "Office space measurement" },
      { label: "D", text: "Salary range" },
    ],
    correctAnswer: "B",
    explanation: "In a workplace context, bandwidth refers to a person's or team's available capacity to take on additional work or responsibilities.",
    category: "Business Terminology",
  },
  {
    id: 28,
    question: "What is 'lead generation' in marketing?",
    options: [
      { label: "A", text: "Creating leadership programmes" },
      { label: "B", text: "Process of attracting potential customers" },
      { label: "C", text: "Manufacturing raw materials" },
      { label: "D", text: "Team building activities" },
    ],
    correctAnswer: "B",
    explanation: "Lead generation is the process of attracting and converting strangers and prospects into someone who has indicated interest in your company's product or service.",
    category: "Sales & Marketing",
  },
  {
    id: 29,
    question: "What does 'compliance' mean in a corporate setting?",
    options: [
      { label: "A", text: "Employee agreement" },
      { label: "B", text: "Adhering to laws, regulations, and internal policies" },
      { label: "C", text: "Customer satisfaction" },
      { label: "D", text: "Product quality standards" },
    ],
    correctAnswer: "B",
    explanation: "Compliance refers to conforming to rules, regulations, laws, and internal policies that govern how a business operates.",
    category: "Legal",
  },
  {
    id: 30,
    question: "What is a 'pivot' in startup terminology?",
    options: [
      { label: "A", text: "Office furniture" },
      { label: "B", text: "A fundamental change in business strategy" },
      { label: "C", text: "A type of investor" },
      { label: "D", text: "Financial audit" },
    ],
    correctAnswer: "B",
    explanation: "A pivot is a fundamental change in the business strategy, often involving changing the product, target market, or business model based on market feedback.",
    category: "Business Strategy",
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
