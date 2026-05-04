/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import type {
  BillingRecord,
  Child,
  Document,
  HospitalVisit,
  Prescription,
  Vaccination,
} from '@/types';
import type { ApiError, ApiResponse, CreateDocumentInput } from './contracts';

type AuthTokenProvider = () => string | null;

async function parseResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return {
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Unexpected non-JSON response from API.',
      },
    };
  }
  return (await res.json()) as ApiResponse<T>;
}

function toApiError(err: unknown, fallback: string): ApiError {
  if (typeof err === 'string' && err.trim()) {
    return { code: 'INTERNAL_ERROR', message: err.trim() };
  }
  if (err && typeof err === 'object' && 'message' in err) {
    const raw = (err as { message?: unknown }).message;
    if (typeof raw === 'string' && raw.trim()) {
      const codeRaw = (err as { code?: unknown }).code;
      const code =
        typeof codeRaw === 'string' && codeRaw.trim() ? (codeRaw.trim() as ApiError['code']) : 'INTERNAL_ERROR';
      return { code, message: raw.trim() };
    }
  }
  if (err instanceof Error && err.message.trim()) {
    return { code: 'INTERNAL_ERROR', message: err.message.trim() };
  }
  return { code: 'INTERNAL_ERROR', message: fallback };
}

export class ThinApiClient {
  constructor(
    private readonly basePath: string,
    private readonly getToken: AuthTokenProvider,
  ) {}

  private async request<T>(path: string, init: RequestInit, fallbackError: string): Promise<T> {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated.');

    const headers = new Headers(init.headers ?? {});
    headers.set('Authorization', `Bearer ${token}`);
    if (init.body != null) headers.set('Content-Type', 'application/json');

    const res = await fetch(`${this.basePath}${path}`, {
      ...init,
      headers,
    });
    const payload = await parseResponse<T>(res);

    if (!payload.ok) {
      const e = toApiError(payload.error, fallbackError);
      throw new Error(e.message);
    }
    return payload.data;
  }

  listChildren() {
    return this.request<Child[]>('/children', { method: 'GET' }, 'Could not load children');
  }
  createChild(child: Child) {
    return this.request<Child>('/children', { method: 'POST', body: JSON.stringify(child) }, 'Could not create child');
  }
  updateChild(child: Child) {
    return this.request<Child>('/children', { method: 'PUT', body: JSON.stringify(child) }, 'Could not update child');
  }
  deleteChild(id: string) {
    return this.request<void>(`/children?id=${encodeURIComponent(id)}`, { method: 'DELETE' }, 'Could not delete child');
  }

  listVisits() {
    return this.request<HospitalVisit[]>('/visits', { method: 'GET' }, 'Could not load visits');
  }
  upsertVisit(visit: HospitalVisit) {
    return this.request<HospitalVisit>('/visits', { method: 'PUT', body: JSON.stringify(visit) }, 'Could not save visit');
  }
  deleteVisit(id: string) {
    return this.request<void>(`/visits?id=${encodeURIComponent(id)}`, { method: 'DELETE' }, 'Could not delete visit');
  }

  listVaccinations() {
    return this.request<Vaccination[]>('/vaccinations', { method: 'GET' }, 'Could not load vaccinations');
  }
  upsertVaccination(vax: Vaccination) {
    return this.request<Vaccination>('/vaccinations', { method: 'PUT', body: JSON.stringify(vax) }, 'Could not save vaccination');
  }
  deleteVaccination(id: string) {
    return this.request<void>(`/vaccinations?id=${encodeURIComponent(id)}`, { method: 'DELETE' }, 'Could not delete vaccination');
  }

  listPrescriptions() {
    return this.request<Prescription[]>('/prescriptions', { method: 'GET' }, 'Could not load prescriptions');
  }
  upsertPrescription(rx: Prescription) {
    return this.request<Prescription>('/prescriptions', { method: 'PUT', body: JSON.stringify(rx) }, 'Could not save prescription');
  }
  deletePrescription(id: string) {
    return this.request<void>(`/prescriptions?id=${encodeURIComponent(id)}`, { method: 'DELETE' }, 'Could not delete prescription');
  }

  listDocuments() {
    return this.request<Document[]>('/documents', { method: 'GET' }, 'Could not load documents');
  }
  createDocument(input: CreateDocumentInput) {
    return this.request<Document>('/documents', { method: 'POST', body: JSON.stringify(input) }, 'Could not upload document');
  }
  deleteDocument(id: string) {
    return this.request<void>(`/documents?id=${encodeURIComponent(id)}`, { method: 'DELETE' }, 'Could not delete document');
  }

  listBilling() {
    return this.request<BillingRecord[]>('/billing', { method: 'GET' }, 'Could not load billing');
  }
  upsertBilling(bill: BillingRecord) {
    return this.request<BillingRecord>('/billing', { method: 'PUT', body: JSON.stringify(bill) }, 'Could not save bill');
  }
  deleteBilling(id: string) {
    return this.request<void>(`/billing?id=${encodeURIComponent(id)}`, { method: 'DELETE' }, 'Could not delete bill');
  }
}

