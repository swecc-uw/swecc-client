import { Member } from '../types';
import api from './api';
import { devPrint } from '../components/utils/RandomUtils';
import { AxiosResponse } from 'axios';
import { deserializeMember } from './member';

export async function searchMembers(nameQuery: string): Promise<Member[]> {
  const url = `/directory/search/?q=${nameQuery}/`;
  const res: AxiosResponse = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200) {
    throw new Error('Failed to search for members');
  }

  if (!Object.prototype.hasOwnProperty.call(res, 'data')) {
    throw new Error('Failed to search for members');
  }

  return res.data.map(deserializeMember);
}

export async function getMemberById(userId: number): Promise<Member> {
  const url = `/directory/${userId}/`;
  const res: AxiosResponse = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200) throw new Error('Failed to get member profile');

  if (!Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get member profile');

  return deserializeMember(res.data);
}
