import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkflowWizard, TrackedJob } from "@/components/WorkflowWizard";
import { JobTracker } from "@/components/JobTracker";
import { InterviewPrep } from "@/components/InterviewPrep";
import { STARInterviewPrep } from "@/components/STARInterviewPrep";
import { CVTemplatePreview } from "@/components/CVTemplatePreview";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, BookOpen, Briefcase, Star, Workflow, LogOut, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";

type View = "workflow" | "templates" | "quiz" | "star" | "tracker";

const Index = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<View>("workflow");
  const [trackedJobs, setTrackedJobs] = useState<TrackedJob[]>([]);
  const [reviewJob, setReviewJob] = useState<TrackedJob | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Auth state management
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth", { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (!session) {
        navigate("/auth", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load jobs from database
  useEffect(() => {
    if (user) {
      loadJobsFromDatabase();
    }
  }, [user]);

  const loadJobsFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const jobs: TrackedJob[] = (data || []).map(row => ({
        id: row.id,
        company: row.company,
        position: row.position,
        status: row.status as TrackedJob["status"],
        date_applied: row.date_applied,
        link: row.link || undefined,
        notes: row.notes || undefined,
        salary: row.salary || undefined,
      }));

      setTrackedJobs(jobs);
    } catch (error) {
      console.error("Error loading jobs:", error);
      toast.error("Failed to load your job applications");
    }
  };

  const handleJobAdded = async (job: TrackedJob) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("job_applications")
        .insert({
          id: job.id,
          user_id: user.id,
          company: job.company,
          position: job.position,
          status: job.status,
          date_applied: job.date_applied,
          link: job.link || null,
          notes: job.notes || null,
          salary: job.salary || null,
        });

      if (error) throw error;

      setTrackedJobs(prev => [job, ...prev]);
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
          link: updatedJob.link || null,
          notes: updatedJob.notes || null,
          salary: updatedJob.salary || null,
        })
        .eq("id", updatedJob.id);

      if (error) throw error;

      setTrackedJobs(prev => prev.map(job => job.id === updatedJob.id ? updatedJob : job));
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
        .eq("id", jobId);

      if (error) throw error;

      setTrackedJobs(prev => prev.filter(job => job.id !== jobId));
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
            <div className="ml-2 h-6 w-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              title="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1.5">Logout</span>
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
