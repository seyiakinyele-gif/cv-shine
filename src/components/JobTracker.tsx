import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Briefcase, Calendar, Building2, Trash2, Edit, ExternalLink, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: "applied" | "screening" | "interview" | "offer" | "rejected";
  date_applied: string;
  link?: string;
  notes?: string;
  salary?: string;
}

const statusConfig = {
  applied: { label: "Applied", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  screening: { label: "Screening", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  interview: { label: "Interview", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  offer: { label: "Offer", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
};

export const JobTracker = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "applied" as JobApplication["status"],
    date_applied: new Date().toISOString().split("T")[0],
    link: "",
    notes: "",
    salary: "",
  });

  useEffect(() => {
    if (user) {
      fetchJobs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs((data || []).map(job => ({
        ...job,
        status: job.status as JobApplication["status"],
        link: job.link || undefined,
        notes: job.notes || undefined,
        salary: job.salary || undefined,
      })));
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load job applications");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      status: "applied",
      date_applied: new Date().toISOString().split("T")[0],
      link: "",
      notes: "",
      salary: "",
    });
    setEditingJob(null);
  };

  const handleOpenDialog = (job?: JobApplication) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        company: job.company,
        position: job.position,
        status: job.status,
        date_applied: job.date_applied,
        link: job.link || "",
        notes: job.notes || "",
        salary: job.salary || "",
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company.trim() || !formData.position.trim()) {
      toast.error("Please fill in company and position");
      return;
    }

    if (!user) {
      toast.error("Please sign in to save applications");
      return;
    }

    try {
      if (editingJob) {
        const { error } = await supabase
          .from("job_applications")
          .update({
            company: formData.company,
            position: formData.position,
            status: formData.status,
            date_applied: formData.date_applied,
            link: formData.link || null,
            notes: formData.notes || null,
            salary: formData.salary || null,
          })
          .eq("id", editingJob.id);

        if (error) throw error;
        toast.success("Job application updated");
      } else {
        const { error } = await supabase
          .from("job_applications")
          .insert({
            user_id: user.id,
            company: formData.company,
            position: formData.position,
            status: formData.status,
            date_applied: formData.date_applied,
            link: formData.link || null,
            notes: formData.notes || null,
            salary: formData.salary || null,
          });

        if (error) throw error;
        toast.success("Job application added");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job application");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("job_applications")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setJobs(jobs.filter(job => job.id !== id));
      toast.success("Job application removed");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job application");
    }
  };

  const handleStatusChange = async (id: string, status: JobApplication["status"]) => {
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      setJobs(jobs.map(job => job.id === id ? { ...job, status } : job));
      toast.success("Status updated");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const stats = {
    total: jobs.length,
    applied: jobs.filter(j => j.status === "applied").length,
    interview: jobs.filter(j => j.status === "interview").length,
    offer: jobs.filter(j => j.status === "offer").length,
  };

  if (!user) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Job Tracker
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track your job applications in one place
          </p>
        </div>
        <Card className="mx-auto max-w-md">
          <CardContent className="py-12 text-center">
            <LogIn className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-foreground">Sign in to track jobs</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your applications will be saved and synced
            </p>
            <Button className="mt-4" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Job Tracker
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track your job applications in one place
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.total, icon: Briefcase },
          { label: "Applied", value: stats.applied, icon: Calendar },
          { label: "Interviews", value: stats.interview, icon: Building2 },
          { label: "Offers", value: stats.offer, icon: Briefcase },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingJob ? "Edit Application" : "Add New Application"}
              </DialogTitle>
              <DialogDescription>
                {editingJob ? "Update the job application details" : "Track a new job application"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Google"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: JobApplication["status"]) => 
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_applied">Date Applied</Label>
                  <Input
                    id="date_applied"
                    type="date"
                    value={formData.date_applied}
                    onChange={(e) => setFormData({ ...formData, date_applied: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary (optional)</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="e.g. £50,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Job Link (optional)</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingJob ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Job List */}
      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-foreground">No applications yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start tracking your job applications
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {job.company}
                        {job.link && (
                          <a
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{job.position}</TableCell>
                    <TableCell>
                      <Select
                        value={job.status}
                        onValueChange={(value: JobApplication["status"]) => 
                          handleStatusChange(job.id, value)
                        }
                      >
                        <SelectTrigger className="w-[130px] border-0 p-0 h-auto">
                          <Badge className={cn("cursor-pointer", statusConfig[job.status].color)}>
                            {statusConfig[job.status].label}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(job.date_applied).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell>{job.salary || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(job)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(job.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
