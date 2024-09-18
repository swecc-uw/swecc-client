export interface SocialField {
  username: string;
  isPrivate: boolean;
}

export interface InterviewAvailability {
  userId: number; // user id
  availability: boolean[][];
}

export interface InterviewPool {
  member: Member;
}

type InterviewStatus =
  | 'pending'
  | 'active'
  | 'inactive_completed'
  | 'inactive_incomplete';

// proposed_by = models.ForeignKey('members.User', on_delete=models.SET_NULL, null=True, related_name='proposed_interviews')
// committed_time = models.DateTimeField(null=True, blank=True)
// date_effective = models.DateTimeField()
// date_completed = models.DateTimeField(null=True, blank=True)

export interface Interview {
  interviewId: string;
  interviewer: number;
  technicalQuestion?: TechnicalQuestion;
  behavioralQuestions: BehavioralQuestion[];
  interviewee: number;
  status: InterviewStatus;
  dateEffective: string; // ISO 8601 date string
  dateCompleted?: string; // ISO 8601 date string or null
  committedTime?: string; // ISO 8601 date string or null
  proposedBy?: number; // user id
  proposedTime?: string; // ISO 8601 date string or null
}

export interface Member {
  id: number; // user id
  username: string;
  created: string; // ISO 8601 date string
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  discordUsername: string;
  discordId: number;
  preview?: string;
  major?: string;
  gradDate?: string; // ISO 8601 date string or null
  linkedin?: SocialField;
  github?: SocialField;
  leetcode?: SocialField;
  resumeUrl?: string;
  local?: string;
  bio?: string;
}

export interface QuestionTopic {
  topicId: string;
  created: string; // ISO 8601 date string
  name: string;
}

export interface TechnicalQuestion {
  questionId: string;
  created: string; // ISO 8601 date string
  createdBy: Member;
  approvedBy?: Member;
  lastAssigned?: string; // ISO 8601 date string or null
  topic: QuestionTopic;
  prompt: string;
  solution: string;
  followUps?: string;
  source?: string;
}

export interface BehavioralQuestion {
  questionId: string;
  created: string; // ISO 8601 date string
  createdBy: Member;
  approvedBy?: Member;
  lastAssigned?: string; // ISO 8601 date string or null
  prompt: string;
  solution: string;
  followUps?: string;
  source?: string;
}

export interface DetailedResponse {
  detail: string;
}

export interface RawInterviewData {
  interview_id: string;
  date_effective: string;
  date_completed: string;
  interviewer: number;
  interviewee: number;
  status: InterviewStatus;
  technical_question: TechnicalQuestion;
  behavioral_questions: BehavioralQuestion[];
  proposed_time: string;
  proposed_by: number;
  committed_time: string;
}

export interface RawInterviewAvailabilityData {
  user_id: number;
  availability: boolean[][];
}

export interface RawMemberData {
  user: number;
  username: string;
  created: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  discord_id: number;
  discord_username: string;
  major?: string;
  preview?: string;
  grad_date?: string;
  linkedin?: SocialField;
  github?: SocialField;
  leetcode?: SocialField;
  resume_url?: string;
  local?: string;
  bio?: string;
}
