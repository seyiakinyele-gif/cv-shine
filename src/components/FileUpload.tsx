import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  file: File | null;
  onClear: () => void;
}

export function FileUpload({ onFileSelect, file, onClear }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const uploadedFile = files[0];
        if (
          uploadedFile.type === "application/pdf" ||
          uploadedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          uploadedFile.type === "text/plain"
        ) {
          onFileSelect(uploadedFile);
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  if (file) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <FileText className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative rounded-lg border-2 border-dashed transition-all duration-200",
        isDragging
          ? "border-primary bg-accent"
          : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
      )}
    >
      <label className="flex cursor-pointer flex-col items-center justify-center gap-3 p-8">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
            isDragging ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          <Upload className="h-6 w-6" />
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground">
            {isDragging ? "Drop your CV here" : "Upload your CV"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            PDF, DOCX, or TXT • Max 10MB
          </p>
        </div>
        <input
          type="file"
          className="absolute inset-0 cursor-pointer opacity-0"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={handleFileInput}
        />
      </label>
    </div>
  );
}
