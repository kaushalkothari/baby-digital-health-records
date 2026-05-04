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
} from '../../src/types';

export interface DomainRepository {
  listChildren(userId: string): Promise<Child[]>;
  createChild(userId: string, child: Child): Promise<Child>;
  updateChild(userId: string, child: Child): Promise<Child>;
  deleteChild(userId: string, id: string): Promise<void>;

  listVisits(userId: string): Promise<HospitalVisit[]>;
  upsertVisit(userId: string, visit: HospitalVisit): Promise<HospitalVisit>;
  deleteVisit(userId: string, id: string): Promise<void>;

  listVaccinations(userId: string): Promise<Vaccination[]>;
  upsertVaccination(userId: string, vax: Vaccination): Promise<Vaccination>;
  deleteVaccination(userId: string, id: string): Promise<void>;

  listPrescriptions(userId: string): Promise<Prescription[]>;
  upsertPrescription(userId: string, rx: Prescription): Promise<Prescription>;
  deletePrescription(userId: string, id: string): Promise<void>;

  listDocuments(userId: string): Promise<Document[]>;
  createDocument(userId: string, doc: Document, dataUrl: string, fileType: string): Promise<Document>;
  deleteDocument(userId: string, id: string): Promise<void>;

  listBilling(userId: string): Promise<BillingRecord[]>;
  upsertBilling(userId: string, bill: BillingRecord): Promise<BillingRecord>;
  deleteBilling(userId: string, id: string): Promise<void>;
}

