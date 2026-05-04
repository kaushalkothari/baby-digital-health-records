/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import * as db from '../../src/lib/supabase/data-access';
import type { Database } from '../../src/lib/supabase/database.types';
import type {
  BillingRecord,
  Child,
  Document,
  HospitalVisit,
  Prescription,
  Vaccination,
} from '../../src/types';
import type { DomainRepository } from './domain-repository';

type Client = SupabaseClient<Database>;

export class SupabaseDomainRepository implements DomainRepository {
  constructor(private readonly client: Client) {}

  private async childIdsFor(userId: string): Promise<string[]> {
    const children = await db.fetchChildrenForUser(this.client, userId);
    return children.map((c) => c.id);
  }

  listChildren(userId: string): Promise<Child[]> {
    return db.fetchChildrenForUser(this.client, userId);
  }

  createChild(userId: string, child: Child): Promise<Child> {
    return db.insertChild(this.client, userId, child);
  }

  updateChild(_userId: string, child: Child): Promise<Child> {
    return db.updateChildRow(this.client, child);
  }

  deleteChild(_userId: string, id: string): Promise<void> {
    return db.deleteChildRow(this.client, id);
  }

  async listVisits(userId: string): Promise<HospitalVisit[]> {
    const ids = await this.childIdsFor(userId);
    return db.fetchVisitsForChildren(this.client, ids);
  }

  upsertVisit(_userId: string, visit: HospitalVisit): Promise<HospitalVisit> {
    return db.upsertVisit(this.client, visit);
  }

  deleteVisit(_userId: string, id: string): Promise<void> {
    return db.deleteVisitRow(this.client, id);
  }

  async listVaccinations(userId: string): Promise<Vaccination[]> {
    const ids = await this.childIdsFor(userId);
    return db.fetchVaccinationsForChildren(this.client, ids);
  }

  upsertVaccination(userId: string, vax: Vaccination): Promise<Vaccination> {
    return db.upsertVaccination(this.client, userId, vax);
  }

  deleteVaccination(_userId: string, id: string): Promise<void> {
    return db.deleteVaccinationRow(this.client, id);
  }

  async listPrescriptions(userId: string): Promise<Prescription[]> {
    const ids = await this.childIdsFor(userId);
    return db.fetchPrescriptionsForChildren(this.client, ids);
  }

  upsertPrescription(userId: string, rx: Prescription): Promise<Prescription> {
    return db.upsertPrescription(this.client, userId, rx);
  }

  deletePrescription(_userId: string, id: string): Promise<void> {
    return db.deletePrescriptionRow(this.client, id);
  }

  async listDocuments(userId: string): Promise<Document[]> {
    const ids = await this.childIdsFor(userId);
    return db.fetchDocumentsForChildren(this.client, ids);
  }

  createDocument(userId: string, doc: Document, dataUrl: string, fileType: string): Promise<Document> {
    return db.insertDocument(this.client, userId, doc, dataUrl, fileType);
  }

  deleteDocument(_userId: string, id: string): Promise<void> {
    return db.deleteDocumentRow(this.client, id);
  }

  async listBilling(userId: string): Promise<BillingRecord[]> {
    const ids = await this.childIdsFor(userId);
    return db.fetchBillingForChildren(this.client, ids);
  }

  upsertBilling(userId: string, bill: BillingRecord): Promise<BillingRecord> {
    return db.upsertBilling(this.client, userId, bill);
  }

  deleteBilling(_userId: string, id: string): Promise<void> {
    return db.deleteBillingRow(this.client, id);
  }
}

