import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Copy, Check, RefreshCw, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const StandaloneCoverLetter = () => {
  const [cvContent, setCvContent] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!cvContent.trim() || !jobDescription.trim()) {
      toast.error("Please provide both your CV and the job description");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-cover-letter", {
        body: { cvContent, jobDescription },
      });

      if (error) {
        toast.error(error.message || "Failed to generate cover letter");
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setCoverLetter(data.coverLetter);
      toast.success("Cover letter generated!");
    } catch (err) {
      console.error("Error generating cover letter:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!coverLetter) return;
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setEditContent(coverLetter || "");
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setCoverLetter(editContent);
    setIsEditing(false);
    toast.success("Cover letter updated!");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Cover Letter Generator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Paste your CV and job description to generate a tailored cover letter
        </p>
      </div>

      {!coverLetter ? (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <label className="font-medium text-foreground">Your CV / Résumé</label>
              </div>
              <Textarea
                placeholder="Paste your CV content here..."
                value={cvContent}
                onChange={(e) => setCvContent(e.target.value)}
                className="min-h-[250px] resize-none border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-primary"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                  <Mail className="h-4 w-4 text-accent-foreground" />
                </div>
                <label className="font-medium text-foreground">Job Description</label>
              </div>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[250px] resize-none border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating || !cvContent.trim() || !jobDescription.trim()}
              className="min-w-[200px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Your Cover Letter</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <RefreshCw className="mr-1 h-3 w-3" />}
                Regenerate
              </Button>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  Edit
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setCoverLetter(null)}>
                New
              </Button>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[400px] resize-none border-border bg-card text-foreground"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {coverLetter}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
