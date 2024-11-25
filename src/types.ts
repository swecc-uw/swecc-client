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

export type Status = 'pending' | 'active' | 'inactive';

export interface Interview {
  interviewId: string;
  interviewer: number;
  technicalQuestions?: TechnicalQuestion[];
  behavioralQuestions?: BehavioralQuestion[];
  interviewee: number;
  status: Status;
  dateEffective: string; // ISO 8601 date string
  dateCompleted?: string; // ISO 8601 date string or null
}

export interface HydratedInterview {
  interviewId: string;
  interviewer: Member;
  technicalQuestions?: TechnicalQuestion[];
  behavioralQuestions?: BehavioralQuestion[];
  interviewee: Member;
  status: Status;
  dateEffective: string; // ISO 8601 date string
  dateCompleted?: string; // ISO 8601 date string or null
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
  groups?: { name: string }[];
  profilePictureUrl?: string;
}

export interface QuestionTopic {
  topicId: string;
  created: string; // ISO 8601 date string
  name: string;
}

export interface BaseQuestion {
  questionId: string;
  created: string;
  prompt: string;
}

export interface RawBehavioralQuestion {
  question_id: string;
  created: string;
  created_by: Member;
  approved_by: Member;
  last_assigned: string;
  prompt: string;
  solution: string;
  follow_ups: string;
  source: string;
}

export interface BehavioralQuestion extends BaseQuestion {
  createdBy: Member;
  approvedBy?: Member;
  lastAssigned?: string; // ISO 8601 date string or null
  solution: string;
  followUps?: string;
  source?: string;
}

export enum QuestionType {
  Technical = 'technical',
  Behavioral = 'behavioral',
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
  status: Status;
  technical_questions: RawTechnicalQuestion[];
  behavioral_questions: RawBehavioralQuestion[];
}
export interface RawInterviewAvailabilityData {
  user_id: number;
  availability: boolean[][];
}

export interface RawMemberData {
  id: number;
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
  groups?: { name: string }[];
  profile_picture_url?: string;
}

export interface Topic {
  topicId: string;
  created: string; // ISO 8601 date string
  createdBy: Member;
  name: string;
}

export interface RawTopic {
  topic_id: string;
  created: string; // ISO 8601 date string
  created_by: Member;
  name: string;
}

export interface TechnicalQuestion extends BaseQuestion {
  title: string;
  createdBy: string;
  approvedBy: string;
  lastAssigned: string;
  topic: string;
  topicName: string;
  solution: string;
  followUps: string;
  source: string;
}

export type Question = TechnicalQuestion | BehavioralQuestion;

export interface RawTechnicalQuestion {
  question_id: string;
  title: string;
  created: string;
  created_by: string;
  approved_by: string;
  last_assigned: string;
  topic: RawTopic;
  prompt: string;
  solution: string;
  follow_ups: string;
  source: string;
}

export type ReportType = 'interview' | 'question';

export type ReportStatus = 'pending' | 'resolving' | 'completed';

export interface RawReportBody {
  associated_id: string;
  reporter_user_id?: number; // can be anonymous
  type: ReportType;
  reason: string;
}

export interface ReportBody {
  associatedId: string;
  reporterUserId?: number;
  type: ReportType;
  reason: string;
}

export interface RawReport {
  admin_id?: string;
  admin_notes?: string;
  associated_id?: string;
  created: string;
  reason: string;
  report_id: string;
  reporter_user_id: number;
  status: ReportStatus;
  type: ReportType;
  updated: string;
}

export interface Report {
  adminId?: string;
  adminNotes?: string;
  associatedId?: string;
  created: string;
  reason: string;
  reportId: string;
  reporterUserId: number;
  status: ReportStatus;
  type: ReportType;
  updated: string;
}

export interface RawInterViewPoolStatus {
  number_sign_up: number;
  members: string[];
}

export interface InterviewPoolStatus {
  numberSignUp: number;
  members: string[];
}
