import { useState } from "react";
import { Link } from "react-router-dom";
import { CVInput } from "@/components/CVInput";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { CVTemplatePreview } from "@/components/CVTemplatePreview";
import { InterviewPrep } from "@/components/InterviewPrep";
import { STARInterviewPrep } from "@/components/STARInterviewPrep";
import { JobTracker } from "@/components/JobTracker";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, FileText, BookOpen, Briefcase, LogIn, LogOut, User, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

type View = "optimizer" | "templates" | "interview" | "star" | "tracker";
type InputMode = "file" | "text";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [currentView, setCurrentView] = useState<View>("optimizer");
  const [optimizedCvForTemplates, setOptimizedCvForTemplates] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  const handleUseInTemplates = (content: string) => {
    setOptimizedCvForTemplates(content);
    setCurrentView("templates");
    toast.success("Optimized CV loaded into Templates");
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

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
      toast.success("CV analysis complete!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setCvText("");
    setJobDescription("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden text-sm font-medium text-foreground sm:inline">Seyidaniel Consulting</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant={currentView === "optimizer" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => {
                setCurrentView("optimizer");
                handleReset();
              }}
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Optimiser</span>
            </Button>
            <Button
              variant={currentView === "templates" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("templates")}
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Templates</span>
            </Button>
            <Button
              variant={currentView === "interview" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("interview")}
            >
              <BookOpen className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Quiz</span>
            </Button>
            <Button
              variant={currentView === "star" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("star")}
            >
              <Star className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">STAR</span>
            </Button>
            <Button
              variant={currentView === "tracker" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("tracker")}
            >
              <Briefcase className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tracker</span>
            </Button>
            
            <div className="ml-2 border-l border-border pl-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="mr-1.5 h-3.5 w-3.5" />
                      <span className="hidden sm:inline max-w-[100px] truncate">
                        {user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">
                    <LogIn className="mr-1.5 h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        {currentView === "optimizer" ? (
          <>
            {!result ? (
              <div className="animate-fade-in space-y-8">
                {/* Hero */}
                <div className="text-center">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Optimise Your CV for ATS
                  </h1>
                  <p className="mt-3 text-lg text-muted-foreground">
                    Upload your CV and job description to get instant optimisation suggestions
                  </p>
                </div>

                {/* Upload Section */}
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

                {/* Analyze Button */}
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
                        Analyse CV
                      </>
                    )}
                  </Button>
                </div>

                {/* Features */}
                <div className="mt-12 grid gap-4 sm:grid-cols-3">
                  {[
                    { title: "ATS Score", desc: "Get a compatibility score" },
                    { title: "Keyword Analysis", desc: "Find missing keywords" },
                    { title: "Optimised CV", desc: "Download the improved version" },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border bg-card p-4 text-center"
                    >
                      <p className="font-medium text-foreground">{feature.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <ResultsDisplay result={result} onUseInTemplates={handleUseInTemplates} />
            )}
          </>
        ) : currentView === "templates" ? (
          <CVTemplatePreview 
            optimizedContent={optimizedCvForTemplates} 
            onClearOptimizedContent={() => setOptimizedCvForTemplates(null)}
          />
        ) : currentView === "interview" ? (
          <InterviewPrep />
        ) : currentView === "star" ? (
          <STARInterviewPrep />
        ) : (
          <JobTracker />
        )}
      </main>
    </div>
  );
};

export default Index;
