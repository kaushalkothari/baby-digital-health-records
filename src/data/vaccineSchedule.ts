import { VaccineScheduleItem } from '@/types';

export const vaccineSchedule: VaccineScheduleItem[] = [
  { name: 'BCG', ageInWeeks: 0, description: 'Bacillus Calmette-Guérin – Tuberculosis' },
  { name: 'Hepatitis B (Birth dose)', ageInWeeks: 0, description: 'Hepatitis B - first dose at birth' },
  { name: 'OPV 0', ageInWeeks: 0, description: 'Oral Polio Vaccine – birth dose' },
  { name: 'OPV 1 + IPV 1', ageInWeeks: 6, description: 'Oral & Inactivated Polio – 6 weeks' },
  { name: 'Pentavalent 1', ageInWeeks: 6, description: 'DPT + HepB + Hib – 6 weeks' },
  { name: 'Rotavirus 1', ageInWeeks: 6, description: 'Rotavirus – 6 weeks' },
  { name: 'PCV 1', ageInWeeks: 6, description: 'Pneumococcal Conjugate – 6 weeks' },
  { name: 'OPV 2 + IPV 2', ageInWeeks: 10, description: 'Oral & Inactivated Polio – 10 weeks' },
  { name: 'Pentavalent 2', ageInWeeks: 10, description: 'DPT + HepB + Hib – 10 weeks' },
  { name: 'Rotavirus 2', ageInWeeks: 10, description: 'Rotavirus – 10 weeks' },
  { name: 'OPV 3 + IPV 3', ageInWeeks: 14, description: 'Oral & Inactivated Polio – 14 weeks' },
  { name: 'Pentavalent 3', ageInWeeks: 14, description: 'DPT + HepB + Hib – 14 weeks' },
  { name: 'Rotavirus 3', ageInWeeks: 14, description: 'Rotavirus – 14 weeks' },
  { name: 'PCV 2', ageInWeeks: 14, description: 'Pneumococcal Conjugate – 14 weeks' },
  { name: 'Measles 1 / MR 1', ageInWeeks: 39, description: 'Measles/MR – 9 months' },
  { name: 'Vitamin A (1st dose)', ageInWeeks: 39, description: 'Vitamin A supplement – 9 months' },
  { name: 'PCV Booster', ageInWeeks: 39, description: 'Pneumococcal Conjugate booster – 9 months' },
  { name: 'Measles 2 / MMR', ageInWeeks: 65, description: 'Measles/MMR – 15 months' },
  { name: 'OPV Booster', ageInWeeks: 65, description: 'Oral Polio booster – 15 months' },
  { name: 'DPT Booster 1', ageInWeeks: 78, description: 'DPT first booster – 18 months' },
  { name: 'Vitamin A (2nd-9th dose)', ageInWeeks: 78, description: 'Vitamin A every 6 months from 16 months' },
  { name: 'DPT Booster 2', ageInWeeks: 260, description: 'DPT second booster – 5 years' },
  { name: 'Td / TT', ageInWeeks: 520, description: 'Tetanus & Diphtheria – 10 years' },
  { name: 'Td / TT (16 years)', ageInWeeks: 832, description: 'Tetanus & Diphtheria – 16 years' },
];

export function getVaccineDueDate(dateOfBirth: string, ageInWeeks: number): string {
  const dob = new Date(dateOfBirth);
  const dueDate = new Date(dob.getTime() + ageInWeeks * 7 * 24 * 60 * 60 * 1000);
  return dueDate.toISOString().split('T')[0];
}
