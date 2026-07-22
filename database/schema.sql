-- Recruitment Workbench Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enums
CREATE TYPE job_status AS ENUM ('hiring', 'paused', 'completed', 'cancelled');
CREATE TYPE candidate_stage AS ENUM ('resume', 'phone', 'referral', 'first_interview', 'second_interview', 'hrbp', 'offer', 'onboard', 'eliminated', 'withdrawn');
CREATE TYPE communication_method AS ENUM ('phone', 'wechat', 'boss', 'email', 'offline', 'other');
CREATE TYPE interview_status AS ENUM ('pending', 'scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE interview_result AS ENUM ('pass', 'fail', 'pending');
CREATE TYPE todo_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE todo_type AS ENUM ('follow_up', 'interview', 'offer', 'leader_feedback', 'supplement', 'other');

-- Jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT '',
  leader TEXT NOT NULL DEFAULT '',
  hc INTEGER NOT NULL DEFAULT 1,
  location TEXT NOT NULL DEFAULT '',
  salary_range TEXT NOT NULL DEFAULT '',
  jd TEXT NOT NULL DEFAULT '',
  requirements_must TEXT NOT NULL DEFAULT '',
  requirements_nice TEXT NOT NULL DEFAULT '',
  education_requirement TEXT NOT NULL DEFAULT '',
  experience_requirement TEXT NOT NULL DEFAULT '',
  channels TEXT[] NOT NULL DEFAULT '{}',
  status job_status NOT NULL DEFAULT 'hiring',
  notes TEXT NOT NULL DEFAULT '',
  expected_completion_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Candidates table
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  age INTEGER,
  education TEXT NOT NULL DEFAULT '',
  school TEXT NOT NULL DEFAULT '',
  major TEXT NOT NULL DEFAULT '',
  work_years INTEGER,
  current_company TEXT NOT NULL DEFAULT '',
  current_position TEXT NOT NULL DEFAULT '',
  expected_salary TEXT NOT NULL DEFAULT '',
  expected_city TEXT NOT NULL DEFAULT '',
  source_channel TEXT NOT NULL DEFAULT '',
  resume_notes TEXT NOT NULL DEFAULT '',
  communication_notes TEXT NOT NULL DEFAULT '',
  stage candidate_stage NOT NULL DEFAULT 'resume',
  last_contacted_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,
  is_recommended BOOLEAN NOT NULL DEFAULT false,
  is_interview_scheduled BOOLEAN NOT NULL DEFAULT false,
  is_offered BOOLEAN NOT NULL DEFAULT false,
  is_onboarded BOOLEAN NOT NULL DEFAULT false,
  is_eliminated BOOLEAN NOT NULL DEFAULT false,
  elimination_reason TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Communications table
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  contact_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  method communication_method NOT NULL DEFAULT 'other',
  content TEXT NOT NULL DEFAULT '',
  feedback TEXT NOT NULL DEFAULT '',
  our_action TEXT NOT NULL DEFAULT '',
  next_follow_up_at TIMESTAMPTZ,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Interviews table
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  round TEXT NOT NULL DEFAULT 'first',
  interviewer TEXT NOT NULL DEFAULT '',
  scheduled_at TIMESTAMPTZ NOT NULL,
  location_or_link TEXT NOT NULL DEFAULT '',
  status interview_status NOT NULL DEFAULT 'pending',
  result interview_result NOT NULL DEFAULT 'pending',
  feedback TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Offers table
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL UNIQUE REFERENCES candidates(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  offer_date DATE NOT NULL DEFAULT CURRENT_DATE,
  salary TEXT NOT NULL DEFAULT '',
  bonus TEXT NOT NULL DEFAULT '',
  equity TEXT NOT NULL DEFAULT '',
  is_accepted BOOLEAN NOT NULL DEFAULT false,
  is_onboarded BOOLEAN NOT NULL DEFAULT false,
  expected_onboard_date DATE,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Work logs table
CREATE TABLE work_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_items TEXT NOT NULL DEFAULT '',
  contacts_count INTEGER NOT NULL DEFAULT 0,
  referrals_count INTEGER NOT NULL DEFAULT 0,
  interviews_count INTEGER NOT NULL DEFAULT 0,
  jobs_progressed TEXT NOT NULL DEFAULT '',
  issues TEXT NOT NULL DEFAULT '',
  tomorrow_plan TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(date, user_id)
);

-- Todos table
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  priority todo_priority NOT NULL DEFAULT 'medium',
  is_completed BOOLEAN NOT NULL DEFAULT false,
  due_date DATE,
  related_job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  related_candidate_id UUID REFERENCES candidates(id) ON DELETE SET NULL,
  todo_type todo_type NOT NULL DEFAULT 'other',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_candidates_job_id ON candidates(job_id);
CREATE INDEX idx_candidates_stage ON candidates(stage);
CREATE INDEX idx_candidates_user_id ON candidates(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_communications_candidate_id ON communications(candidate_id);
CREATE INDEX idx_communications_user_id ON communications(user_id);
CREATE INDEX idx_interviews_candidate_id ON interviews(candidate_id);
CREATE INDEX idx_interviews_user_id ON interviews(user_id);
CREATE INDEX idx_offers_candidate_id ON offers(candidate_id);
CREATE INDEX idx_offers_user_id ON offers(user_id);
CREATE INDEX idx_work_logs_user_id ON work_logs(user_id);
CREATE INDEX idx_work_logs_date ON work_logs(date);
CREATE INDEX idx_todos_user_id ON todos(user_id);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_candidates_updated_at BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_offers_updated_at BEFORE UPDATE ON offers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_work_logs_updated_at BEFORE UPDATE ON work_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: Enable on all tables
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- RLS Policies: each user sees only their own rows
CREATE POLICY "Users own jobs" ON jobs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own candidates" ON candidates FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own communications" ON communications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own interviews" ON interviews FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own offers" ON offers FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own work_logs" ON work_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own todos" ON todos FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
