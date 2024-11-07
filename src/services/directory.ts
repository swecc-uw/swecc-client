import { Member } from '../types';
import api from './api';
import { devPrint } from '../components/utils/RandomUtils';
import { AxiosResponse } from 'axios';
import { deserializeMember } from './member';

interface Cache<T> {
  data: T;
  timestamp: number;
}

interface CacheStore {
  members: { [key: string]: Cache<Member[]> };
  memberProfiles: { [key: number]: Cache<Member> };
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 min

const cache: CacheStore = {
  members: {},
  memberProfiles: {},
};

function isCacheValid<T>(cache: Cache<T>): boolean {
  return Date.now() - cache.timestamp <= CACHE_DURATION;
}

function setCache<T>(store: { [key: string]: Cache<T> }, key: string, data: T) {
  store[key] = {
    data,
    timestamp: Date.now(),
  };
}

export async function searchMembers(
  nameQuery: string,
  useCache = false
): Promise<Member[]> {
  if (
    useCache &&
    cache.members[nameQuery] &&
    isCacheValid(cache.members[nameQuery])
  ) {
    devPrint('Using cached search results for:', nameQuery);
    return cache.members[nameQuery].data;
  }

  const url = `/directory/search/?q=${nameQuery}`;
  const res: AxiosResponse = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200) {
    throw new Error('Failed to search for members');
  }

  if (!Object.prototype.hasOwnProperty.call(res, 'data')) {
    throw new Error('Failed to search for members');
  }

  const members = res.data.map(deserializeMember);

  if (useCache) {
    setCache(cache.members, nameQuery, members);
  }

  return members;
}

export async function getMemberById(
  userId: number,
  useCache = false
): Promise<Member> {
  if (
    useCache &&
    cache.memberProfiles[userId] &&
    isCacheValid(cache.memberProfiles[userId])
  ) {
    devPrint('Using cached member profile for:', userId);
    return cache.memberProfiles[userId].data;
  }

  const url = `/directory/${userId}/`;
  const res: AxiosResponse = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200) throw new Error('Failed to get member profile');

  if (!Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get member profile');

  const member = deserializeMember(res.data);

  if (useCache) {
    setCache(cache.memberProfiles, userId.toString(), member);
  }

  return member;
}

export function clearMemberCache(): void {
  cache.members = {};
  cache.memberProfiles = {};
}

export function clearMemberSearchCache(nameQuery: string): void {
  delete cache.members[nameQuery];
}

export function clearMemberProfileCache(userId: number): void {
  delete cache.memberProfiles[userId];
}
