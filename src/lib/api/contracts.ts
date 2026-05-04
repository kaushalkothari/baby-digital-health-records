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

export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'TRANSIENT'
  | 'INTERNAL_ERROR';

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
};

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiFailure = {
  ok: false;
  error: ApiError;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type CreateDocumentInput = {
  document: Document;
  dataUrl: string;
  fileType: string;
};

export type ThinApiRoutes = {
  children: Child;
  visits: HospitalVisit;
  vaccinations: Vaccination;
  prescriptions: Prescription;
  documents: Document;
  billing: BillingRecord;
};

