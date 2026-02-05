import { useState } from "react";
import { FileUpload } from "./FileUpload";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Type } from "lucide-react";
import { cn } from "@/lib/utils";

type InputMode = "file" | "text";

interface CVInputProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  cvText: string;
  onCvTextChange: (text: string) => void;
  inputMode: InputMode;
  onInputModeChange: (mode: InputMode) => void;
}

export function CVInput({
  file,
  onFileSelect,
  onFileClear,
  cvText,
  onCvTextChange,
  inputMode,
  onInputModeChange,
}: CVInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Your CV</label>
        <div className="flex rounded-lg border border-border bg-muted/50 p-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onInputModeChange("file")}
            className={cn(
              "h-7 px-3 text-xs",
              inputMode === "file"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Upload className="mr-1.5 h-3 w-3" />
            Upload
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onInputModeChange("text")}
            className={cn(
              "h-7 px-3 text-xs",
              inputMode === "text"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Type className="mr-1.5 h-3 w-3" />
            Text
          </Button>
        </div>
      </div>

      {inputMode === "file" ? (
        <FileUpload
          file={file}
          onFileSelect={onFileSelect}
          onClear={onFileClear}
        />
      ) : (
        <Textarea
          placeholder="Paste your CV content here..."
          value={cvText}
          onChange={(e) => onCvTextChange(e.target.value)}
          className="min-h-[180px] resize-none border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-primary"
        />
      )}
    </div>
  );
}
