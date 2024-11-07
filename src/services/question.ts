import { devPrint } from '../components/utils/RandomUtils';
import {
  TechnicalQuestion,
  BehavioralQuestion,
  Topic,
  RawTopic,
  RawTechnicalQuestion,
} from '../types';
import api from './api';

export function deserializeTopic({
  topic_id: topicId,
  created_by: createdBy,
  ...rest
}: RawTopic): Topic {
  return {
    topicId,
    createdBy,
    ...rest,
  };
}

export function deserializeQuestion({
  question_id: questionId,
  created_by: createdBy,
  approved_by: approvedBy,
  last_assigned: lastAssigned,
  follow_ups: followUps,
  topic,
  ...rest
}: RawTechnicalQuestion): TechnicalQuestion {
  return {
    ...rest,
    questionId,
    createdBy,
    approvedBy,
    lastAssigned,
    followUps,
    topicName: topic.name,
    topic: topic.topic_id,
  };
}

// TODO: Implement this endpoint
export async function getTechnicalQuestionsForInterview(
  _interviewId: string
): Promise<TechnicalQuestion[]> {
  return [];
  return new Promise((_resolve, reject) => {
    reject('Not implemented');
  });
}

// TODO: Implement this endpoint
export async function getBehavioralQuestionsForInterview(
  _interviewId: string
): Promise<BehavioralQuestion[]> {
  return [];
  return new Promise((_resolve, reject) => {
    reject('Not implemented');
  });
}

export async function getTechnicalQuestions(): Promise<TechnicalQuestion[]> {
  const url = `/questions/technical/all/`;

  const res = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get questions');

  return res.data.map(deserializeQuestion);
}

export async function getTechnicalQuestion(
  id: string
): Promise<TechnicalQuestion> {
  const url = `/questions/technical/${id}/`;

  const res = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get questions');

  return deserializeQuestion(res.data);
}

export async function createTechnicalQuestion(
  question: Partial<TechnicalQuestion>
): Promise<TechnicalQuestion> {
  const url = `/questions/technical/`;

  const res = await api.post(url, question);
  devPrint('res:', res);

  if (res.status !== 201 || !Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get questions');

  return deserializeQuestion(res.data);
}

export async function updateTechnicalQuestion(
  question: Partial<TechnicalQuestion>
): Promise<TechnicalQuestion> {
  const url = `/questions/technical/${question.questionId}/`;

  const { followUps: follow_ups, ...rest } = question;

  const res = await api.put(url, { ...rest, follow_ups });
  devPrint('res:', res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get questions');

  return deserializeQuestion(res.data);
}

export async function getTopics(): Promise<Topic[]> {
  const url = `/questions/topics/`;

  const res = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get questions');

  return res.data.map(deserializeTopic);
}

export async function createNewTopic(topicName: string): Promise<Topic> {
  const url = `/questions/topics/`;

  const res = await api.post(url, { name: topicName });
  devPrint('res:', res);

  if (res.status !== 201) throw new Error('Failed to create topic name');

  return deserializeTopic(res.data);
}
