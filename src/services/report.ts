import { devPrint } from '../components/utils/RandomUtils';
import { parseAnyDate } from '../localization';
import { RawReport, RawReportBody, Report, ReportBody } from '../types';
import api from './api';

function deserializedReport({
  report_id: reportId,
  reporter_user_id: reporterUserId,
  admin_id: adminId,
  admin_notes: adminNotes,
  associated_id: associatedId,
  associated_object: associatedObject,
  created,
  updated,
  ...rest
}: RawReport): Report {
  return {
    ...rest,
    reportId,
    reporterUserId,
    adminId,
    adminNotes,
    associatedId,
    associatedObject: JSON.stringify(associatedObject),
    created: parseAnyDate(created),
    updated: parseAnyDate(updated),
  };
}

function serializedReportBody({
  associatedId: associated_id,
  reporterUserId: reporter_user_id,
  ...rest
}: ReportBody): RawReportBody {
  return {
    ...rest,
    associated_id,
    reporter_user_id,
  };
}

export async function getAllReport(): Promise<Report[]> {
  const url = `/reports/all/`;

  const res = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get reports');

  const reports: Report[] = res.data.reports?.map(deserializedReport);
  return reports;
}

export async function createReport(body: ReportBody): Promise<Report> {
  const url = `/reports/`;
  const res = await api.post(url, serializedReportBody(body));
  devPrint('res:', res);
  if (res.status !== 201 || !Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to create report');
  return deserializedReport(res.data.report);
}

export async function getMyReport(memberId: number): Promise<Report[]> {
  const url = `/reports/users/${memberId}/`;

  const res = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get reports');

  const reports: Report[] = res.data.map(deserializedReport);

  return reports;
}

export async function getReportDetail(reportId: string): Promise<Report> {
  const url = `/reports/${reportId}/`;

  const res = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get report');

  return deserializedReport(res.data);
}
