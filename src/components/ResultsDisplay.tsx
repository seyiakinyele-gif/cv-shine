import { CheckCircle, AlertTriangle, Info, Copy, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

interface ResultsDisplayProps {
  result: OptimizationResult;
  onUseInTemplates?: (content: string) => void;
}

export function ResultsDisplay({ result, onUseInTemplates }: ResultsDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-success/10";
    if (score >= 60) return "bg-warning/10";
    return "bg-destructive/10";
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.optimizedContent);
    toast.success("Optimised CV copied to clipboard");
  };

  const handleDownload = () => {
    const blob = new Blob([result.optimizedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized-cv.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("CV downloaded");
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* ATS Score */}
      <div className={`rounded-xl p-6 ${getScoreBg(result.score)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">ATS Compatibility Score</p>
            <p className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
              {result.score}%
            </p>
          </div>
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${getScoreBg(result.score)}`}>
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/30"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${result.score * 2.51} 251`}
                className={getScoreColor(result.score)}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Keywords Analysis */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold text-foreground">Keyword Analysis</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-success">Found Keywords</p>
            <div className="flex flex-wrap gap-2">
              {result.keywords.found.map((keyword, i) => (
                <span
                  key={i}
                  className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-warning">Missing Keywords</p>
            <div className="flex flex-wrap gap-2">
              {result.keywords.missing.map((keyword, i) => (
                <span
                  key={i}
                  className="rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold text-foreground">Suggestions</h3>
        <div className="space-y-3">
          {result.suggestions.map((suggestion, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-lg bg-muted/50 p-4"
            >
              {suggestion.type === "success" && (
                <CheckCircle className="h-5 w-5 shrink-0 text-success" />
              )}
              {suggestion.type === "warning" && (
                <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
              )}
              {suggestion.type === "info" && (
                <Info className="h-5 w-5 shrink-0 text-primary" />
              )}
              <div>
                <p className="font-medium text-foreground">{suggestion.title}</p>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimised Content */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Optimised CV</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            {onUseInTemplates && (
              <Button size="sm" onClick={() => onUseInTemplates(result.optimizedContent)}>
                <FileText className="mr-2 h-4 w-4" />
                Use in Templates
              </Button>
            )}
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto rounded-lg bg-muted p-4">
          <pre className="whitespace-pre-wrap text-sm text-foreground">
            {result.optimizedContent}
          </pre>
        </div>
      </div>
    </div>
  );
}
