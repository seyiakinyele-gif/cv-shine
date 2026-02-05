import { useState } from "react";
import { WorkflowWizard, TrackedJob } from "@/components/WorkflowWizard";
import { JobTracker } from "@/components/JobTracker";
import { InterviewPrep } from "@/components/InterviewPrep";
import { STARInterviewPrep } from "@/components/STARInterviewPrep";
import { CVTemplatePreview } from "@/components/CVTemplatePreview";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, BookOpen, Briefcase, Star, Workflow } from "lucide-react";

type View = "workflow" | "templates" | "quiz" | "star" | "tracker";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("workflow");
  const [trackedJobs, setTrackedJobs] = useState<TrackedJob[]>([]);
  const [reviewJob, setReviewJob] = useState<TrackedJob | null>(null);

  const handleJobAdded = (job: TrackedJob) => {
    setTrackedJobs(prev => [job, ...prev]);
  };

  const handleJobUpdated = (updatedJob: TrackedJob) => {
    setTrackedJobs(prev => prev.map(job => job.id === updatedJob.id ? updatedJob : job));
  };

  const handleJobDeleted = (jobId: string) => {
    setTrackedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const handleReviewJob = (job: TrackedJob) => {
    setReviewJob(job);
    setCurrentView("workflow");
  };

  const handleClearReview = () => {
    setReviewJob(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden text-sm font-medium text-foreground sm:inline">Seyidaniel Consulting</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant={currentView === "workflow" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("workflow")}
            >
              <Workflow className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Workflow</span>
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
              variant={currentView === "quiz" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("quiz")}
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
              className="relative"
            >
              <Briefcase className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tracker</span>
              {trackedJobs.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {trackedJobs.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        {currentView === "workflow" && (
          <WorkflowWizard 
            onJobAdded={handleJobAdded}
            onJobUpdated={handleJobUpdated}
            reviewJob={reviewJob}
            onClearReview={handleClearReview}
          />
        )}
        {currentView === "templates" && (
          <CVTemplatePreview />
        )}
        {currentView === "quiz" && (
          <InterviewPrep />
        )}
        {currentView === "star" && (
          <STARInterviewPrep />
        )}
        {currentView === "tracker" && (
          <JobTracker 
            jobs={trackedJobs}
            onJobAdded={handleJobAdded}
            onJobUpdated={handleJobUpdated}
            onJobDeleted={handleJobDeleted}
            onReviewJob={handleReviewJob}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
