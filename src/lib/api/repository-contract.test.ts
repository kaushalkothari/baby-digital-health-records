/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import { describe, expect, it, vi } from 'vitest';
import type { DomainRepository } from '../../../api/_server/domain-repository';
import { runRepositoryConformanceSuite } from './repository-contract';

function fakeRepo(): DomainRepository {
  return {
    listChildren: vi.fn(async () => []),
    createChild: vi.fn(async (_userId, child) => child),
    updateChild: vi.fn(async (_userId, child) => child),
    deleteChild: vi.fn(async () => {}),
    listVisits: vi.fn(async () => []),
    upsertVisit: vi.fn(async (_userId, v) => v),
    deleteVisit: vi.fn(async () => {}),
    listVaccinations: vi.fn(async () => []),
    upsertVaccination: vi.fn(async (_userId, v) => v),
    deleteVaccination: vi.fn(async () => {}),
    listPrescriptions: vi.fn(async () => []),
    upsertPrescription: vi.fn(async (_userId, p) => p),
    deletePrescription: vi.fn(async () => {}),
    listDocuments: vi.fn(async () => []),
    createDocument: vi.fn(async (_userId, doc) => doc),
    deleteDocument: vi.fn(async () => {}),
    listBilling: vi.fn(async () => []),
    upsertBilling: vi.fn(async (_userId, b) => b),
    deleteBilling: vi.fn(async () => {}),
  };
}

describe('repository conformance harness', () => {
  it('exercises the complete repository contract', async () => {
    const repo = fakeRepo();
    const now = new Date().toISOString();
    await runRepositoryConformanceSuite(repo, 'user-1', {
      child: { id: 'c1', name: 'Kid', dateOfBirth: '2024-01-01', gender: 'other', createdAt: now },
      visit: {
        id: 'v1',
        childId: 'c1',
        date: '2025-01-01',
        hospitalName: 'Hospital',
        doctorName: 'Doctor',
        reason: 'Checkup',
        description: 'Routine',
        createdAt: now,
      },
      vaccination: { id: 'vx1', childId: 'c1', vaccineName: 'OPV', dueDate: '2025-02-01', createdAt: now },
      prescription: {
        id: 'rx1',
        childId: 'c1',
        prescribingDoctor: 'Doctor',
        date: '2025-01-01',
        active: true,
        createdAt: now,
      },
      document: {
        id: 'd1',
        childId: 'c1',
        name: 'Doc',
        type: 'other',
        fileData: 'data:image/png;base64,AA==',
        fileType: 'image/png',
        date: '2025-01-01',
        createdAt: now,
      },
      billing: {
        id: 'b1',
        childId: 'c1',
        date: '2025-01-01',
        amount: 100,
        hospitalName: 'Hospital',
        description: 'Consultation',
        createdAt: now,
      },
    });

    expect(repo.listChildren).toHaveBeenCalled();
    expect(repo.listVisits).toHaveBeenCalled();
    expect(repo.listVaccinations).toHaveBeenCalled();
    expect(repo.listPrescriptions).toHaveBeenCalled();
    expect(repo.listDocuments).toHaveBeenCalled();
    expect(repo.listBilling).toHaveBeenCalled();
  });
});

