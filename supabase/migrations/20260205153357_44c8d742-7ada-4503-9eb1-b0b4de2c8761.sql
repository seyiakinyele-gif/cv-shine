-- Add workflow_data column to store the full workflow state
ALTER TABLE public.job_applications 
ADD COLUMN workflow_data JSONB DEFAULT NULL;

-- Add a comment explaining the structure
COMMENT ON COLUMN public.job_applications.workflow_data IS 'Stores workflow state: cvContent, jobDescription, analysisResult, optimizedCvContent, quizComplete, starComplete';