export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string
          title: string
          department: string
          leader: string
          hc: number
          location: string
          salary_range: string
          jd: string
          requirements_must: string
          requirements_nice: string
          education_requirement: string
          experience_requirement: string
          channels: string[]
          status: 'hiring' | 'paused' | 'completed' | 'cancelled'
          notes: string
          expected_completion_date: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          department?: string
          leader?: string
          hc?: number
          location?: string
          salary_range?: string
          jd?: string
          requirements_must?: string
          requirements_nice?: string
          education_requirement?: string
          experience_requirement?: string
          channels?: string[]
          status?: 'hiring' | 'paused' | 'completed' | 'cancelled'
          notes?: string
          expected_completion_date?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          department?: string
          leader?: string
          hc?: number
          location?: string
          salary_range?: string
          jd?: string
          requirements_must?: string
          requirements_nice?: string
          education_requirement?: string
          experience_requirement?: string
          channels?: string[]
          status?: 'hiring' | 'paused' | 'completed' | 'cancelled'
          notes?: string
          expected_completion_date?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      candidates: {
        Row: {
          id: string
          job_id: string
          name: string
          phone: string
          email: string
          age: number | null
          education: string
          school: string
          major: string
          work_years: number | null
          current_company: string
          current_position: string
          expected_salary: string
          expected_city: string
          source_channel: string
          resume_notes: string
          communication_notes: string
          stage: 'resume' | 'phone' | 'referral' | 'first_interview' | 'second_interview' | 'hrbp' | 'offer' | 'onboard' | 'eliminated' | 'withdrawn'
          last_contacted_at: string | null
          next_follow_up_at: string | null
          is_recommended: boolean
          is_interview_scheduled: boolean
          is_offered: boolean
          is_onboarded: boolean
          is_eliminated: boolean
          elimination_reason: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          job_id: string
          name: string
          phone?: string
          email?: string
          age?: number | null
          education?: string
          school?: string
          major?: string
          work_years?: number | null
          current_company?: string
          current_position?: string
          expected_salary?: string
          expected_city?: string
          source_channel?: string
          resume_notes?: string
          communication_notes?: string
          stage?: 'resume' | 'phone' | 'referral' | 'first_interview' | 'second_interview' | 'hrbp' | 'offer' | 'onboard' | 'eliminated' | 'withdrawn'
          last_contacted_at?: string | null
          next_follow_up_at?: string | null
          is_recommended?: boolean
          is_interview_scheduled?: boolean
          is_offered?: boolean
          is_onboarded?: boolean
          is_eliminated?: boolean
          elimination_reason?: string
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          job_id?: string
          name?: string
          phone?: string
          email?: string
          age?: number | null
          education?: string
          school?: string
          major?: string
          work_years?: number | null
          current_company?: string
          current_position?: string
          expected_salary?: string
          expected_city?: string
          source_channel?: string
          resume_notes?: string
          communication_notes?: string
          stage?: 'resume' | 'phone' | 'referral' | 'first_interview' | 'second_interview' | 'hrbp' | 'offer' | 'onboard' | 'eliminated' | 'withdrawn'
          last_contacted_at?: string | null
          next_follow_up_at?: string | null
          is_recommended?: boolean
          is_interview_scheduled?: boolean
          is_offered?: boolean
          is_onboarded?: boolean
          is_eliminated?: boolean
          elimination_reason?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      communications: {
        Row: {
          id: string
          candidate_id: string
          contact_time: string
          method: 'phone' | 'wechat' | 'boss' | 'email' | 'offline' | 'other'
          content: string
          feedback: string
          our_action: string
          next_follow_up_at: string | null
          notes: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          candidate_id: string
          contact_time?: string
          method?: 'phone' | 'wechat' | 'boss' | 'email' | 'offline' | 'other'
          content?: string
          feedback?: string
          our_action?: string
          next_follow_up_at?: string | null
          notes?: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          candidate_id?: string
          contact_time?: string
          method?: 'phone' | 'wechat' | 'boss' | 'email' | 'offline' | 'other'
          content?: string
          feedback?: string
          our_action?: string
          next_follow_up_at?: string | null
          notes?: string
          created_at?: string
          user_id?: string
        }
      }
      interviews: {
        Row: {
          id: string
          candidate_id: string
          job_id: string
          round: string
          interviewer: string
          scheduled_at: string
          location_or_link: string
          status: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          result: 'pass' | 'fail' | 'pending'
          feedback: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          candidate_id: string
          job_id: string
          round?: string
          interviewer?: string
          scheduled_at: string
          location_or_link?: string
          status?: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          result?: 'pass' | 'fail' | 'pending'
          feedback?: string
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          candidate_id?: string
          job_id?: string
          round?: string
          interviewer?: string
          scheduled_at?: string
          location_or_link?: string
          status?: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          result?: 'pass' | 'fail' | 'pending'
          feedback?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      offers: {
        Row: {
          id: string
          candidate_id: string
          job_id: string
          offer_date: string
          salary: string
          bonus: string
          equity: string
          is_accepted: boolean
          is_onboarded: boolean
          expected_onboard_date: string | null
          notes: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          candidate_id: string
          job_id: string
          offer_date?: string
          salary?: string
          bonus?: string
          equity?: string
          is_accepted?: boolean
          is_onboarded?: boolean
          expected_onboard_date?: string | null
          notes?: string
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          candidate_id?: string
          job_id?: string
          offer_date?: string
          salary?: string
          bonus?: string
          equity?: string
          is_accepted?: boolean
          is_onboarded?: boolean
          expected_onboard_date?: string | null
          notes?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      work_logs: {
        Row: {
          id: string
          date: string
          completed_items: string
          contacts_count: number
          referrals_count: number
          interviews_count: number
          jobs_progressed: string
          issues: string
          tomorrow_plan: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          date?: string
          completed_items?: string
          contacts_count?: number
          referrals_count?: number
          interviews_count?: number
          jobs_progressed?: string
          issues?: string
          tomorrow_plan?: string
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          date?: string
          completed_items?: string
          contacts_count?: number
          referrals_count?: number
          interviews_count?: number
          jobs_progressed?: string
          issues?: string
          tomorrow_plan?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      todos: {
        Row: {
          id: string
          title: string
          description: string
          priority: 'low' | 'medium' | 'high'
          is_completed: boolean
          due_date: string | null
          related_job_id: string | null
          related_candidate_id: string | null
          todo_type: 'follow_up' | 'interview' | 'offer' | 'leader_feedback' | 'supplement' | 'other'
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          priority?: 'low' | 'medium' | 'high'
          is_completed?: boolean
          due_date?: string | null
          related_job_id?: string | null
          related_candidate_id?: string | null
          todo_type?: 'follow_up' | 'interview' | 'offer' | 'leader_feedback' | 'supplement' | 'other'
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          priority?: 'low' | 'medium' | 'high'
          is_completed?: boolean
          due_date?: string | null
          related_job_id?: string | null
          related_candidate_id?: string | null
          todo_type?: 'follow_up' | 'interview' | 'offer' | 'leader_feedback' | 'supplement' | 'other'
          created_at?: string
          user_id?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {
      job_status: 'hiring' | 'paused' | 'completed' | 'cancelled'
      candidate_stage: 'resume' | 'phone' | 'referral' | 'first_interview' | 'second_interview' | 'hrbp' | 'offer' | 'onboard' | 'eliminated' | 'withdrawn'
      communication_method: 'phone' | 'wechat' | 'boss' | 'email' | 'offline' | 'other'
      interview_status: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'no_show'
      interview_result: 'pass' | 'fail' | 'pending'
      todo_priority: 'low' | 'medium' | 'high'
      todo_type: 'follow_up' | 'interview' | 'offer' | 'leader_feedback' | 'supplement' | 'other'
    }
  }
}
