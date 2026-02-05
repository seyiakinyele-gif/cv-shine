-- Create table for STAR interview answers
CREATE TABLE public.star_interview_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_description TEXT NOT NULL,
  question TEXT NOT NULL,
  situation TEXT,
  task TEXT,
  action TEXT,
  result TEXT,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.star_interview_answers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own STAR answers"
ON public.star_interview_answers
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own STAR answers"
ON public.star_interview_answers
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own STAR answers"
ON public.star_interview_answers
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own STAR answers"
ON public.star_interview_answers
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_star_answers_updated_at
BEFORE UPDATE ON public.star_interview_answers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();