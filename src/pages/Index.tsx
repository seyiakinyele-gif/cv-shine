import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ATSTemplates } from "@/components/ATSTemplates";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, FileText } from "lucide-react";
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

type View = "optimizer" | "templates";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [currentView, setCurrentView] = useState<View>("optimizer");

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      toast.error("Please upload a CV and enter a job description");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const cvContent = await readFileContent(file);

      const { data, error } = await supabase.functions.invoke("optimize-cv", {
        body: { cvContent, jobDescription },
      });

      if (error) {
        console.error("Error:", error);
        toast.error(error.message || "Failed to analyze CV");
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
            <span className="font-semibold text-foreground">Seyidanielsdesigns CV Guide</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={currentView === "optimizer" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => {
                setCurrentView("optimizer");
                handleReset();
              }}
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Optimiser
            </Button>
            <Button
              variant={currentView === "templates" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("templates")}
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Templates
            </Button>
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
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Your CV</label>
                    <FileUpload
                      file={file}
                      onFileSelect={setFile}
                      onClear={() => setFile(null)}
                    />
                  </div>
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
                    disabled={isAnalyzing || !file || !jobDescription.trim()}
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
              <ResultsDisplay result={result} />
            )}
          </>
        ) : (
          <ATSTemplates />
        )}
      </main>
    </div>
  );
};

export default Index;
