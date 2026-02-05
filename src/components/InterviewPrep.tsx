import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle, ChevronRight, RotateCcw, BookOpen, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  category: string;
  jobRole: string;
}

const jobRoles = [
  { id: "general", name: "General Business" },
  { id: "software", name: "Software Engineering" },
  { id: "marketing", name: "Marketing" },
  { id: "finance", name: "Finance & Accounting" },
  { id: "hr", name: "Human Resources" },
  { id: "sales", name: "Sales" },
  { id: "project", name: "Project Management" },
  { id: "data", name: "Data & Analytics" },
];

const questionBank: Question[] = [
  // General Business Questions
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
    jobRole: "general",
  },
  {
    id: 2,
    question: "What does 'ROI' measure?",
    options: [
      { label: "A", text: "Employee satisfaction" },
      { label: "B", text: "Return on Investment" },
      { label: "C", text: "Rate of Inflation" },
      { label: "D", text: "Risk of Implementation" },
    ],
    correctAnswer: "B",
    explanation: "ROI (Return on Investment) is a performance measure used to evaluate the efficiency of an investment.",
    category: "Business Metrics",
    jobRole: "general",
  },
  {
    id: 3,
    question: "What does 'SWOT' analysis examine?",
    options: [
      { label: "A", text: "Sales, Wages, Operations, Taxes" },
      { label: "B", text: "Strengths, Weaknesses, Opportunities, Threats" },
      { label: "C", text: "Systems, Workflows, Outputs, Timelines" },
      { label: "D", text: "Strategy, Work, Organisation, Training" },
    ],
    correctAnswer: "B",
    explanation: "SWOT analysis identifies Strengths, Weaknesses, Opportunities, and Threats related to business planning.",
    category: "Strategy",
    jobRole: "general",
  },
  {
    id: 4,
    question: "What is 'scalability' in business?",
    options: [
      { label: "A", text: "The weight of products" },
      { label: "B", text: "Ability to grow without structural constraints" },
      { label: "C", text: "A pricing model" },
      { label: "D", text: "Employee ranking system" },
    ],
    correctAnswer: "B",
    explanation: "Scalability refers to a company's ability to grow and manage increased demand without compromising performance.",
    category: "Business Strategy",
    jobRole: "general",
  },

  // Software Engineering Questions
  {
    id: 10,
    question: "What does 'API' stand for?",
    options: [
      { label: "A", text: "Automated Process Integration" },
      { label: "B", text: "Application Programming Interface" },
      { label: "C", text: "Advanced Product Information" },
      { label: "D", text: "Analytical Performance Index" },
    ],
    correctAnswer: "B",
    explanation: "API (Application Programming Interface) is a set of protocols for building software that allows different systems to communicate.",
    category: "Technical",
    jobRole: "software",
  },
  {
    id: 11,
    question: "What is 'CI/CD' in software development?",
    options: [
      { label: "A", text: "Code Integration/Code Deployment" },
      { label: "B", text: "Continuous Integration/Continuous Deployment" },
      { label: "C", text: "Customer Interface/Customer Design" },
      { label: "D", text: "Central Intelligence/Central Data" },
    ],
    correctAnswer: "B",
    explanation: "CI/CD refers to Continuous Integration and Continuous Deployment, practices that automate building, testing, and deploying code.",
    category: "DevOps",
    jobRole: "software",
  },
  {
    id: 12,
    question: "What is 'technical debt'?",
    options: [
      { label: "A", text: "Money owed for software licences" },
      { label: "B", text: "Cost of maintaining poorly written code" },
      { label: "C", text: "Hardware expenses" },
      { label: "D", text: "Training costs" },
    ],
    correctAnswer: "B",
    explanation: "Technical debt is the implied cost of future rework caused by choosing quick solutions over better approaches.",
    category: "Development",
    jobRole: "software",
  },
  {
    id: 13,
    question: "What does 'REST' stand for in web services?",
    options: [
      { label: "A", text: "Remote Execution Service Technology" },
      { label: "B", text: "Representational State Transfer" },
      { label: "C", text: "Reliable Server Transactions" },
      { label: "D", text: "Resource Evaluation System" },
    ],
    correctAnswer: "B",
    explanation: "REST (Representational State Transfer) is an architectural style for designing networked applications.",
    category: "Technical",
    jobRole: "software",
  },

  // Marketing Questions
  {
    id: 20,
    question: "What does 'SEO' stand for?",
    options: [
      { label: "A", text: "Sales Enhancement Operations" },
      { label: "B", text: "Search Engine Optimisation" },
      { label: "C", text: "Social Engagement Outreach" },
      { label: "D", text: "Strategic Enterprise Objectives" },
    ],
    correctAnswer: "B",
    explanation: "SEO (Search Engine Optimisation) is the practice of increasing website traffic through organic search results.",
    category: "Digital Marketing",
    jobRole: "marketing",
  },
  {
    id: 21,
    question: "What is a 'conversion rate'?",
    options: [
      { label: "A", text: "Currency exchange rate" },
      { label: "B", text: "Percentage of visitors who take a desired action" },
      { label: "C", text: "Employee turnover rate" },
      { label: "D", text: "Website loading speed" },
    ],
    correctAnswer: "B",
    explanation: "Conversion rate is the percentage of users who complete a desired action, such as making a purchase or signing up.",
    category: "Metrics",
    jobRole: "marketing",
  },
  {
    id: 22,
    question: "What does 'CTR' measure?",
    options: [
      { label: "A", text: "Customer Trust Rating" },
      { label: "B", text: "Click-Through Rate" },
      { label: "C", text: "Content Transfer Rate" },
      { label: "D", text: "Campaign Tracking Results" },
    ],
    correctAnswer: "B",
    explanation: "CTR (Click-Through Rate) measures the percentage of people who click on a link compared to total viewers.",
    category: "Digital Marketing",
    jobRole: "marketing",
  },
  {
    id: 23,
    question: "What is 'lead generation'?",
    options: [
      { label: "A", text: "Creating leadership programmes" },
      { label: "B", text: "Attracting potential customers" },
      { label: "C", text: "Manufacturing raw materials" },
      { label: "D", text: "Team building activities" },
    ],
    correctAnswer: "B",
    explanation: "Lead generation is the process of attracting and converting strangers into potential customers.",
    category: "Sales & Marketing",
    jobRole: "marketing",
  },

  // Finance Questions
  {
    id: 30,
    question: "What does 'P&L' refer to?",
    options: [
      { label: "A", text: "Planning and Logistics" },
      { label: "B", text: "Profit and Loss" },
      { label: "C", text: "Performance and Learning" },
      { label: "D", text: "Products and Licensing" },
    ],
    correctAnswer: "B",
    explanation: "P&L (Profit and Loss) statement summarises revenues, costs, and expenses during a specific period.",
    category: "Financial Reporting",
    jobRole: "finance",
  },
  {
    id: 31,
    question: "What is 'EBITDA'?",
    options: [
      { label: "A", text: "Earnings Before Interest, Taxes, Depreciation, Amortisation" },
      { label: "B", text: "External Business Investment Tax Deduction Analysis" },
      { label: "C", text: "Enterprise Budget Integration Data Assessment" },
      { label: "D", text: "Estimated Balance In Total Debt Allocation" },
    ],
    correctAnswer: "A",
    explanation: "EBITDA measures a company's overall financial performance and is used as an alternative to net income.",
    category: "Financial Metrics",
    jobRole: "finance",
  },
  {
    id: 32,
    question: "What is 'due diligence'?",
    options: [
      { label: "A", text: "Meeting deadlines" },
      { label: "B", text: "Comprehensive appraisal before a transaction" },
      { label: "C", text: "Employee punctuality" },
      { label: "D", text: "Legal compliance only" },
    ],
    correctAnswer: "B",
    explanation: "Due diligence is a comprehensive appraisal of a business prior to signing a contract or making an investment.",
    category: "Finance",
    jobRole: "finance",
  },
  {
    id: 33,
    question: "What is a 'fiscal year'?",
    options: [
      { label: "A", text: "The calendar year" },
      { label: "B", text: "A 12-month period for financial reporting" },
      { label: "C", text: "The tax deadline" },
      { label: "D", text: "Quarterly earnings period" },
    ],
    correctAnswer: "B",
    explanation: "A fiscal year is a 12-month period used for accounting purposes, which may differ from the calendar year.",
    category: "Accounting",
    jobRole: "finance",
  },

  // HR Questions
  {
    id: 40,
    question: "What does 'onboarding' refer to in HR?",
    options: [
      { label: "A", text: "Firing employees" },
      { label: "B", text: "Integrating new employees" },
      { label: "C", text: "Annual performance reviews" },
      { label: "D", text: "Exit interviews" },
    ],
    correctAnswer: "B",
    explanation: "Onboarding is the process of integrating new employees including training, orientation, and cultural assimilation.",
    category: "HR Processes",
    jobRole: "hr",
  },
  {
    id: 41,
    question: "What is 'employee engagement'?",
    options: [
      { label: "A", text: "Marriage proposals at work" },
      { label: "B", text: "Emotional commitment to the organisation" },
      { label: "C", text: "Employment contracts" },
      { label: "D", text: "Work schedules" },
    ],
    correctAnswer: "B",
    explanation: "Employee engagement refers to the emotional commitment employees have to their organisation and its goals.",
    category: "HR Metrics",
    jobRole: "hr",
  },
  {
    id: 42,
    question: "What does 'attrition rate' measure?",
    options: [
      { label: "A", text: "Customer complaints" },
      { label: "B", text: "Rate of employee turnover" },
      { label: "C", text: "Sales performance" },
      { label: "D", text: "Training completion" },
    ],
    correctAnswer: "B",
    explanation: "Attrition rate measures the rate at which employees leave an organisation over a given period.",
    category: "HR Metrics",
    jobRole: "hr",
  },
  {
    id: 43,
    question: "What is a 'competency framework'?",
    options: [
      { label: "A", text: "Building regulations" },
      { label: "B", text: "Skills and behaviours needed for job success" },
      { label: "C", text: "Competition analysis" },
      { label: "D", text: "Compensation structure" },
    ],
    correctAnswer: "B",
    explanation: "A competency framework defines the skills, knowledge, and behaviours required for effective job performance.",
    category: "HR Development",
    jobRole: "hr",
  },

  // Sales Questions
  {
    id: 50,
    question: "What does 'B2B' mean?",
    options: [
      { label: "A", text: "Back to Business" },
      { label: "B", text: "Business to Business" },
      { label: "C", text: "Budget to Budget" },
      { label: "D", text: "Brand to Brand" },
    ],
    correctAnswer: "B",
    explanation: "B2B (Business to Business) refers to commerce transactions between businesses.",
    category: "Sales Model",
    jobRole: "sales",
  },
  {
    id: 51,
    question: "What is a 'sales pipeline'?",
    options: [
      { label: "A", text: "Oil transportation" },
      { label: "B", text: "Stages prospects go through to become customers" },
      { label: "C", text: "Communication channels" },
      { label: "D", text: "Data transfer method" },
    ],
    correctAnswer: "B",
    explanation: "A sales pipeline is a visual representation of where prospects are in the sales process.",
    category: "Sales Process",
    jobRole: "sales",
  },
  {
    id: 52,
    question: "What does 'CRM' stand for?",
    options: [
      { label: "A", text: "Customer Retention Method" },
      { label: "B", text: "Corporate Risk Management" },
      { label: "C", text: "Customer Relationship Management" },
      { label: "D", text: "Client Revenue Model" },
    ],
    correctAnswer: "C",
    explanation: "CRM (Customer Relationship Management) is technology for managing customer relationships and interactions.",
    category: "Sales Tools",
    jobRole: "sales",
  },
  {
    id: 53,
    question: "What is 'churn rate'?",
    options: [
      { label: "A", text: "Employee productivity" },
      { label: "B", text: "Rate customers stop doing business with you" },
      { label: "C", text: "Manufacturing speed" },
      { label: "D", text: "Inventory turnover" },
    ],
    correctAnswer: "B",
    explanation: "Churn rate is the percentage of customers who stop using a company's product or service.",
    category: "Sales Metrics",
    jobRole: "sales",
  },

  // Project Management Questions
  {
    id: 60,
    question: "What does 'Agile' primarily refer to?",
    options: [
      { label: "A", text: "A strict waterfall methodology" },
      { label: "B", text: "An iterative approach to project delivery" },
      { label: "C", text: "A type of project budget" },
      { label: "D", text: "A risk assessment tool" },
    ],
    correctAnswer: "B",
    explanation: "Agile is an iterative approach to project management using short development cycles called sprints.",
    category: "Methodology",
    jobRole: "project",
  },
  {
    id: 61,
    question: "What is 'scope creep'?",
    options: [
      { label: "A", text: "A type of project software" },
      { label: "B", text: "Uncontrolled expansion of project scope" },
      { label: "C", text: "A team meeting format" },
      { label: "D", text: "Budget reduction technique" },
    ],
    correctAnswer: "B",
    explanation: "Scope creep refers to uncontrolled expansion of project scope without adjustments to time, cost, and resources.",
    category: "Project Risks",
    jobRole: "project",
  },
  {
    id: 62,
    question: "What is a 'deliverable'?",
    options: [
      { label: "A", text: "A shipping method" },
      { label: "B", text: "Tangible output from project work" },
      { label: "C", text: "The project deadline" },
      { label: "D", text: "The project budget" },
    ],
    correctAnswer: "B",
    explanation: "A deliverable is any tangible or intangible product produced as a result of project work.",
    category: "Project Terms",
    jobRole: "project",
  },
  {
    id: 63,
    question: "What does 'OKR' stand for?",
    options: [
      { label: "A", text: "Operational Knowledge Review" },
      { label: "B", text: "Objectives and Key Results" },
      { label: "C", text: "Organisational Key Resources" },
      { label: "D", text: "Output and Knowledge Ratio" },
    ],
    correctAnswer: "B",
    explanation: "OKR (Objectives and Key Results) is a goal-setting framework used to define and track measurable goals.",
    category: "Planning",
    jobRole: "project",
  },

  // Data & Analytics Questions
  {
    id: 70,
    question: "What is 'ETL' in data processing?",
    options: [
      { label: "A", text: "External Transfer Logic" },
      { label: "B", text: "Extract, Transform, Load" },
      { label: "C", text: "Enterprise Technology Layer" },
      { label: "D", text: "Estimated Time Limit" },
    ],
    correctAnswer: "B",
    explanation: "ETL (Extract, Transform, Load) is the process of copying data from sources into a destination system.",
    category: "Data Engineering",
    jobRole: "data",
  },
  {
    id: 71,
    question: "What is 'data warehousing'?",
    options: [
      { label: "A", text: "Storing physical goods" },
      { label: "B", text: "Central repository for integrated data" },
      { label: "C", text: "Cloud storage pricing" },
      { label: "D", text: "Database backup" },
    ],
    correctAnswer: "B",
    explanation: "Data warehousing is a system for collecting and managing data from varied sources for business intelligence.",
    category: "Data Architecture",
    jobRole: "data",
  },
  {
    id: 72,
    question: "What does 'A/B testing' measure?",
    options: [
      { label: "A", text: "Employee performance grades" },
      { label: "B", text: "Comparing two versions to see which performs better" },
      { label: "C", text: "Quality assurance standards" },
      { label: "D", text: "Security vulnerabilities" },
    ],
    correctAnswer: "B",
    explanation: "A/B testing compares two versions of something to determine which one performs better.",
    category: "Analytics",
    jobRole: "data",
  },
  {
    id: 73,
    question: "What is a 'data lake'?",
    options: [
      { label: "A", text: "A type of swimming pool" },
      { label: "B", text: "Storage repository for raw data in native format" },
      { label: "C", text: "Database backup location" },
      { label: "D", text: "Water cooling system for servers" },
    ],
    correctAnswer: "B",
    explanation: "A data lake is a storage repository that holds vast amounts of raw data in its native format.",
    category: "Data Architecture",
    jobRole: "data",
  },
];

export const InterviewPrep = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const filteredQuestions = questionBank.filter(q => q.jobRole === selectedRole);
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const isCorrect = currentQuestion && selectedAnswer === currentQuestion.correctAnswer;

  const handleStartQuiz = () => {
    if (!selectedRole) return;
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
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
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setSelectedRole("");
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
  };

  const handleChangeRole = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
  };

  // Role selection screen
  if (!quizStarted) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Interview Preparation
          </h1>
          <p className="mt-2 text-muted-foreground">
            Select your job role to get relevant interview questions
          </p>
        </div>

        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Select Your Job Role
            </CardTitle>
            <CardDescription>
              Questions will be tailored to your chosen role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a job role..." />
              </SelectTrigger>
              <SelectContent>
                {jobRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedRole && (
              <p className="text-sm text-muted-foreground">
                {filteredQuestions.length} questions available for this role
              </p>
            )}

            <Button 
              onClick={handleStartQuiz} 
              disabled={!selectedRole}
              className="w-full"
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz complete screen
  if (quizComplete) {
    const percentage = Math.round((score / filteredQuestions.length) * 100);
    const roleName = jobRoles.find(r => r.id === selectedRole)?.name || "General";
    
    return (
      <div className="animate-fade-in space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Interview Preparation
          </h1>
          <p className="mt-2 text-muted-foreground">{roleName} Quiz Complete</p>
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
                You got {score} out of {filteredQuestions.length} questions correct
              </p>
            </div>
            
            <div className="rounded-lg bg-muted p-4">
              {percentage >= 80 ? (
                <p className="text-center text-foreground">
                  🎉 Excellent! You have a strong grasp of {roleName.toLowerCase()} terminology.
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
              <Button onClick={handleChangeRole} variant="outline" className="flex-1">
                Change Role
              </Button>
              <Button onClick={handleRestartQuiz} className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Restart Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz in progress
  const roleName = jobRoles.find(r => r.id === selectedRole)?.name || "General";

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Interview Preparation
        </h1>
        <p className="mt-2 text-muted-foreground">
          {roleName} - Test your knowledge
        </p>
      </div>

      {/* Progress */}
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <Badge variant="secondary">
          <BookOpen className="mr-1.5 h-3 w-3" />
          {currentQuestion?.category}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {filteredQuestions.length}
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
                {currentQuestionIndex < filteredQuestions.length - 1 ? (
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
          {filteredQuestions.map((_, index) => (
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
