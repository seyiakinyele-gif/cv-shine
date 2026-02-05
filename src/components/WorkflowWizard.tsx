import { useState } from "react";
import { CVInput } from "@/components/CVInput";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { CVTemplatePreview } from "@/components/CVTemplatePreview";
import { InterviewPrepWizard } from "@/components/InterviewPrepWizard";
import { STARInterviewPrepWizard } from "@/components/STARInterviewPrepWizard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2, ChevronRight, ChevronLeft, CheckCircle, FileText, BookOpen, Star, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface OptimizationResult {
  score: number;
  optimizedContent: string;
  suggestions: {
    type: "success" | "warning" | "info";
    title: string;
    description: string;
  }[];
  keywords: {
    found: string[];
    missing: string[];
  };
}

interface TrackedJob {
  id: string;
  company: string;
  position: string;
  status: "applied" | "screening" | "interview" | "offer" | "rejected";
  date_applied: string;
  notes?: string;
}

type InputMode = "file" | "text";

const STEPS = [
  { id: 1, name: "Upload CV", icon: FileText },
  { id: 2, name: "Results", icon: Sparkles },
  { id: 3, name: "Template", icon: FileText },
  { id: 4, name: "Quiz", icon: BookOpen },
  { id: 5, name: "STAR", icon: Star },
  { id: 6, name: "Complete", icon: CheckCircle },
];

interface WorkflowWizardProps {
  onJobAdded: (job: TrackedJob) => void;
}

export const WorkflowWizard = ({ onJobAdded }: WorkflowWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [optimizedCvContent, setOptimizedCvContent] = useState<string | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [starComplete, setStarComplete] = useState(false);
  const [extractedJobInfo, setExtractedJobInfo] = useState<{ company: string; position: string } | null>(null);

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const getCvContent = async (): Promise<string> => {
    if (inputMode === "text") {
      return cvText;
    }
    if (file) {
      return await readFileContent(file);
    }
    return "";
  };

  const hasValidCv = inputMode === "file" ? !!file : cvText.trim().length > 0;

  // Extract company and position from job description
  const extractJobInfo = (jd: string): { company: string; position: string } => {
    const lines = jd.split('\n').filter(l => l.trim());
    let company = "Unknown Company";
    let position = "Unknown Position";
    
    // Simple heuristics to extract info
    for (const line of lines.slice(0, 10)) {
      const lower = line.toLowerCase();
      if (lower.includes('company') || lower.includes('employer') || lower.includes('organization')) {
        const parts = line.split(/[:\-–]/);
        if (parts[1]) company = parts[1].trim();
      }
      if (lower.includes('position') || lower.includes('role') || lower.includes('title') || lower.includes('job title')) {
        const parts = line.split(/[:\-–]/);
        if (parts[1]) position = parts[1].trim();
      }
    }
    
    // If not found, use first few words as position
    if (position === "Unknown Position" && lines[0]) {
      position = lines[0].slice(0, 50).trim();
    }
    
    return { company, position };
  };

  const handleAnalyze = async () => {
    if (!hasValidCv || !jobDescription.trim()) {
      toast.error("Please provide a CV and enter a job description");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const cvContent = await getCvContent();

      const { data, error } = await supabase.functions.invoke("optimize-cv", {
        body: { cvContent, jobDescription },
      });

      if (error) {
        console.error("Error:", error);
        toast.error(error.message || "Failed to analyse CV");
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setResult(data);
      setOptimizedCvContent(data.optimizedContent);
      
      // Extract job info and auto-save to tracker
      const jobInfo = extractJobInfo(jobDescription);
      setExtractedJobInfo(jobInfo);
      
      const newJob: TrackedJob = {
        id: crypto.randomUUID(),
        company: jobInfo.company,
        position: jobInfo.position,
        status: "applied",
        date_applied: new Date().toISOString().split("T")[0],
        notes: `ATS Score: ${data.score}%`,
      };
      onJobAdded(newJob);
      
      toast.success("CV analysis complete! Job added to tracker.");
      setCurrentStep(2);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFile(null);
    setCvText("");
    setJobDescription("");
    setResult(null);
    setOptimizedCvContent(null);
    setQuizComplete(false);
    setStarComplete(false);
    setExtractedJobInfo(null);
  };

  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Application Workflow</h2>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
        
        {/* Step Indicators */}
        <div className="flex justify-between">
          {STEPS.map((step) => {
            const StepIcon = step.icon;
            const isActive = step.id === currentStep;
            const isComplete = step.id < currentStep;
            
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center gap-1 ${
                  isActive ? "text-primary" : isComplete ? "text-success" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : isComplete
                      ? "border-success bg-success/10"
                      : "border-muted"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>
                <span className="hidden text-xs sm:block">{step.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Upload Your CV & Job Description
              </h1>
              <p className="mt-2 text-muted-foreground">
                Start by providing your CV and the job you're applying for
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <CVInput
                file={file}
                onFileSelect={setFile}
                onFileClear={() => setFile(null)}
                cvText={cvText}
                onCvTextChange={setCvText}
                inputMode={inputMode}
                onInputModeChange={setInputMode}
              />
              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
              />
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !hasValidCv || !jobDescription.trim()}
                className="min-w-[200px]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analysing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyse & Continue
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && result && (
          <div className="animate-fade-in space-y-6">
            <ResultsDisplay result={result} />
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext}>
                Continue to Templates
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-fade-in space-y-6">
            <CVTemplatePreview
              optimizedContent={optimizedCvContent}
              onClearOptimizedContent={() => setOptimizedCvContent(null)}
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext}>
                Continue to Quiz
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-fade-in space-y-6">
            <InterviewPrepWizard
              jobDescription={jobDescription}
              onComplete={() => setQuizComplete(true)}
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} variant={quizComplete ? "default" : "outline"}>
                {quizComplete ? "Continue to STAR" : "Skip to STAR"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="animate-fade-in space-y-6">
            <STARInterviewPrepWizard
              jobDescription={jobDescription}
              onComplete={() => setStarComplete(true)}
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} variant={starComplete ? "default" : "outline"}>
                {starComplete ? "Complete Workflow" : "Skip & Complete"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="animate-fade-in space-y-8 text-center py-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Workflow Complete!
              </h1>
              <p className="mt-2 text-muted-foreground">
                Your application for {extractedJobInfo?.position || "this role"} at {extractedJobInfo?.company || "this company"} has been tracked.
              </p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-2xl font-bold text-primary">{result?.score || 0}%</p>
                <p className="text-sm text-muted-foreground">ATS Score</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-2xl font-bold text-primary">{quizComplete ? "✓" : "—"}</p>
                <p className="text-sm text-muted-foreground">Quiz Done</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-2xl font-bold text-primary">{starComplete ? "✓" : "—"}</p>
                <p className="text-sm text-muted-foreground">STAR Prep</p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={handleReset}>
                <Briefcase className="mr-2 h-4 w-4" />
                Start New Application
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
