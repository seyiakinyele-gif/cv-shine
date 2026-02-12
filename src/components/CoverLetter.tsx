import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CoverLetterProps {
  cvContent: string;
  jobDescription: string;
  coverLetter: string | null;
  onCoverLetterGenerated: (letter: string) => void;
}

export const CoverLetter = ({ cvContent, jobDescription, coverLetter, onCoverLetterGenerated }: CoverLetterProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!cvContent || !jobDescription) {
      toast.error("CV content and job description are required");
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

      onCoverLetterGenerated(data.coverLetter);
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
    onCoverLetterGenerated(editContent);
    setIsEditing(false);
    toast.success("Cover letter updated!");
  };

  if (!coverLetter) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground">Generate Cover Letter</h3>
          <p className="mt-2 max-w-md text-muted-foreground">
            Create a tailored cover letter based on your optimised CV and the job description.
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Cover Letter
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
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
  );
};
