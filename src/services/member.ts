import { devPrint } from '../components/utils/RandomUtils';
import { Member, RawMemberData } from '../types';
import api from './api';

export function deserializeMember({
  first_name: firstName,
  last_name: lastName,
  grad_date: gradDate,
  discord_username: discordUsername,
  resume_url: resumeUrl,
  discord_id: discordId,
  ...rest
}: RawMemberData): Member {
  return {
    ...rest,
    firstName,
    lastName,
    gradDate,
    discordUsername,
    resumeUrl,
    discordId,
  };
}

export function serializeMember(
  member: Partial<Member>
): Partial<RawMemberData> {
  return {
    ...member,
    first_name: member.firstName,
    last_name: member.lastName,
    grad_date: member.gradDate,
    discord_username: member.discordUsername,
    resume_url: member.resumeUrl,
    discord_id: member.discordId,
  };
}

export async function getCurrentUser(): Promise<Member> {
  const url = '/members/profile/';
  const res = await api.get(url);

  devPrint('res:', res);

  if (res.status !== 200) throw new Error('Failed to get current user');

  if (!Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get current user');

  return deserializeMember(res.data);
}

export async function getMemberProfile(userId: number): Promise<Member> {
  const url = `/members/${userId}/`;
  const res = await api.get(url);

  devPrint('res:', res);

  if (res.status !== 200) throw new Error('Failed to get member profile');

  if (!Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get member profile');

  return deserializeMember(res.data);
}

export async function updateMemberProfile(
  profile: Partial<Member>
): Promise<Member> {
  const url = `/members/profile/`;

  const res = await api.put(url, serializeMember(profile));
  devPrint('res:', res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to update member profile');

  return deserializeMember(res.data);
}
