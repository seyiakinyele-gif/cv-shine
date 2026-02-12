import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { WorkflowWizard, TrackedJob } from "@/components/WorkflowWizard";
import { JobTracker } from "@/components/JobTracker";
import { StandaloneCoverLetter } from "@/components/StandaloneCoverLetter";
import { InterviewPrep } from "@/components/InterviewPrep";
import { STARInterviewPrep } from "@/components/STARInterviewPrep";
import { CVTemplatePreview } from "@/components/CVTemplatePreview";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, BookOpen, Briefcase, Star, Workflow, Loader2, LogOut, Mail } from "lucide-react";
import { toast } from "sonner";

type View = "workflow" | "templates" | "coverletter" | "quiz" | "star" | "tracker";

const Index = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<View>("workflow");
  const [trackedJobs, setTrackedJobs] = useState<TrackedJob[]>([]);
  const [reviewJob, setReviewJob] = useState<TrackedJob | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth state management
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [isLoading, user, navigate]);

  // Load jobs from database
  useEffect(() => {
    if (user) {
      loadJobsFromDatabase();
    }
  }, [user]);

  const loadJobsFromDatabase = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const jobs: TrackedJob[] = data.map((row) => {
          const workflowData = row.workflow_data as Record<string, unknown> | null;
          return {
            id: row.id,
            company: row.company,
            position: row.position,
            status: row.status as TrackedJob["status"],
            date_applied: row.date_applied,
            notes: row.notes || "",
            link: row.link || "",
            salary: row.salary || "",
            workflowData: workflowData ? {
              cvContent: (workflowData.cvContent as string) || "",
              jobDescription: (workflowData.jobDescription as string) || "",
              result: workflowData.result as any || null,
              optimizedCvContent: (workflowData.optimizedCvContent as string) || null,
              coverLetter: (workflowData.coverLetter as string) || null,
              quizComplete: (workflowData.quizComplete as boolean) || false,
              starComplete: (workflowData.starComplete as boolean) || false,
            } : undefined,
          };
        });
        setTrackedJobs(jobs);
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
      toast.error("Failed to load job applications");
    }
  };

  const handleJobAdded = async (job: TrackedJob) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase.from("job_applications").insert({
        id: job.id,
        user_id: user.id,
        company: job.company,
        position: job.position,
        status: job.status,
        date_applied: job.date_applied,
        notes: job.notes || null,
        link: job.link || null,
        salary: job.salary || null,
        workflow_data: job.workflowData ? JSON.parse(JSON.stringify(job.workflowData)) : null,
      });
      
      if (error) throw error;
      
      setTrackedJobs(prev => [job, ...prev]);
      toast.success("Job application saved");
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job application");
    } finally {
      setIsSaving(false);
    }
  };

  const handleJobUpdated = async (updatedJob: TrackedJob) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({
          company: updatedJob.company,
          position: updatedJob.position,
          status: updatedJob.status,
          date_applied: updatedJob.date_applied,
          notes: updatedJob.notes || null,
          link: updatedJob.link || null,
          salary: updatedJob.salary || null,
          workflow_data: updatedJob.workflowData ? JSON.parse(JSON.stringify(updatedJob.workflowData)) : null,
        })
        .eq("id", updatedJob.id)
        .eq("user_id", user.id);
      
      if (error) throw error;
      
      setTrackedJobs(prev => prev.map(job => job.id === updatedJob.id ? updatedJob : job));
      toast.success("Job application updated");
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job application");
    } finally {
      setIsSaving(false);
    }
  };

  const handleJobDeleted = async (jobId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("job_applications")
        .delete()
        .eq("id", jobId)
        .eq("user_id", user.id);
      
      if (error) throw error;
      
      setTrackedJobs(prev => prev.filter(job => job.id !== jobId));
      toast.success("Job application deleted");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job application");
    }
  };

  const handleReviewJob = (job: TrackedJob) => {
    setReviewJob(job);
    setCurrentView("workflow");
  };

  const handleClearReview = () => {
    setReviewJob(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
              variant={currentView === "coverletter" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("coverletter")}
            >
              <Mail className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cover Letter</span>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Saving indicator */}
      {isSaving && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-primary-foreground text-sm">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving...
        </div>
      )}

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
        {currentView === "coverletter" && (
          <StandaloneCoverLetter />
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
