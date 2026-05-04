/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import type { DomainRepository } from '../../../api/_server/domain-repository';
import type { BillingRecord, Child, Document, HospitalVisit, Prescription, Vaccination } from '@/types';

/**
 * Shared behavioral harness that future adapters can run against.
 * Keeps migration work focused on implementing the same repository contract.
 */
export async function runRepositoryConformanceSuite(
  repo: DomainRepository,
  userId: string,
  fixtures: {
    child: Child;
    visit: HospitalVisit;
    vaccination: Vaccination;
    prescription: Prescription;
    document: Document;
    billing: BillingRecord;
  },
): Promise<void> {
  await repo.createChild(userId, fixtures.child);
  await repo.upsertVisit(userId, fixtures.visit);
  await repo.upsertVaccination(userId, fixtures.vaccination);
  await repo.upsertPrescription(userId, fixtures.prescription);
  await repo.createDocument(userId, fixtures.document, fixtures.document.fileData, fixtures.document.fileType);
  await repo.upsertBilling(userId, fixtures.billing);

  await repo.listChildren(userId);
  await repo.listVisits(userId);
  await repo.listVaccinations(userId);
  await repo.listPrescriptions(userId);
  await repo.listDocuments(userId);
  await repo.listBilling(userId);

  await repo.deleteBilling(userId, fixtures.billing.id);
  await repo.deleteDocument(userId, fixtures.document.id);
  await repo.deletePrescription(userId, fixtures.prescription.id);
  await repo.deleteVaccination(userId, fixtures.vaccination.id);
  await repo.deleteVisit(userId, fixtures.visit.id);
  await repo.deleteChild(userId, fixtures.child.id);
}

