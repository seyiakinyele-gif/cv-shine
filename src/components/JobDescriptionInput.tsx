import { Textarea } from "@/components/ui/textarea";
import { Briefcase } from "lucide-react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Briefcase className="h-4 w-4 text-accent-foreground" />
        </div>
        <label className="font-medium text-foreground">Job Description</label>
      </div>
      <Textarea
        placeholder="Paste the job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[180px] resize-none border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-primary"
      />
    </div>
  );
}
