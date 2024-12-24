import { parseAnyDate } from '../localization';
import {
  DetailedResponse,
  Interview,
  InterviewAvailability,
  RawInterviewData,
  RawInterviewAvailabilityData,
  HydratedInterview,
  RawMemberData,
  RawInterViewPoolStatus,
  InterviewPoolStatus,
  RawSignup,
} from '../types';
import api from './api';
import { deserializeMember } from './member';
import {
  deserializeTechnicalQuestion,
  deserializeBehavioralQuestion,
} from './question';

export function serializeInterviewPoolStatus({
  number_sign_up: numberSignUp,
  ...rest
}: RawInterViewPoolStatus): InterviewPoolStatus {
  return {
    ...rest,
    numberSignUp,
  };
}

export function deserializeInterview({
  interview_id: interviewId,
  date_effective: dateEffective,
  date_completed: dateCompleted,
  technical_questions: technicalQuestions,
  behavioral_questions: behavioralQuestions,
  ...rest
}: RawInterviewData): Interview {
  return {
    ...rest,
    interviewId,
    dateEffective: parseAnyDate(dateEffective),
    dateCompleted: dateCompleted ? parseAnyDate(dateCompleted) : undefined,
    technicalQuestions:
      technicalQuestions?.map(deserializeTechnicalQuestion) || [],
    behavioralQuestions:
      behavioralQuestions?.map(deserializeBehavioralQuestion) || [],
  };
}

function deserializeInterviewAvailability({
  user_id: userId,
  ...rest
}: RawInterviewAvailabilityData): InterviewAvailability {
  return {
    ...rest,
    userId,
  };
}

export async function getInterviewsForUser(): Promise<Interview[]> {
  const res = await api.get('/interview/interviews/');

  return res.data.map(deserializeInterview);
}

interface InterviewsResponse {
  interviews: Array<
    RawInterviewData & {
      interviewer: RawMemberData;
      interviewee: RawMemberData;
    }
  >;
}

export async function getInterviewsHydratedForUser(): Promise<
  Array<HydratedInterview>
> {
  return api.get<InterviewsResponse>('/interview/all/details').then((res) =>
    res.data.interviews.map((interview) => ({
      ...deserializeInterview(interview),
      interviewer: deserializeMember(interview.interviewer),
      interviewee: deserializeMember(interview.interviewee),
    }))
  );
}

export async function getInterviewById(
  interviewId: string
): Promise<Interview> {
  return api
    .get(`/interview/interviews/${interviewId}/`)
    .then((res) => res.data)
    .then(deserializeInterview);
}

export async function getInterviewAvailabilityForCurrentUser(): Promise<InterviewAvailability> {
  return api
    .get('/interview/availability/')
    .then((res) => res.data)
    .then(deserializeInterviewAvailability);
}

export async function getInterviewAvailabilityForUser(
  userId: number
): Promise<InterviewAvailability> {
  return api
    .get(`/interview/availability/${userId}/`)
    .then((res) => res.data)
    .then(deserializeInterviewAvailability);
}

export async function updateInterviewAvailabilityForCurrentUser(
  availability: InterviewAvailability
): Promise<InterviewAvailability> {
  return api
    .put('/interview/availability/', availability)
    .then((res) => res.data)
    .then(deserializeInterviewAvailability);
}

export async function isCurrentUserSignedUpForInterviewPool(): Promise<boolean> {
  return api.get('/interview/pool/').then((res) => res.data.sign_up);
}

export async function signupCurrentUserForInterviewPool(
  availability: InterviewAvailability
): Promise<DetailedResponse> {
  return api.post('/interview/pool/', availability).then((res) => res.data);
}

export async function deleteCurrentUserFromInterviewPool(): Promise<DetailedResponse> {
  return api.delete('/interview/pool/').then((res) => res.data);
}

export async function getInterviewPoolStatus(): Promise<InterviewPoolStatus> {
  return api
    .get('/interview/status')
    .then((res) => serializeInterviewPoolStatus(res.data));
}

// use Raw type directly to skip deserialization
export function getSignupTimeline(days: number = 20): Promise<RawSignup[]> {
  return api
    .get('/interview/signups/', { params: { days } })
    .then((res) => res.data);
}
