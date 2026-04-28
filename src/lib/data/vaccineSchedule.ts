/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import { VaccineScheduleItem } from "@/types";

/**
 * Consolidated Indian immunization schedule.
 *
 * Primary source : IMA Recommended Immunization Schedule (dose / route / site / remarks)
 * Validation     : National Immunization Schedule (NIS) – India (age milestones)
 * Side effects   : UNICEF India  https://www.unicef.org/india/know-your-childs-immunization-schedule
 */
export const vaccineSchedule: VaccineScheduleItem[] = [
  // ── At Birth ──────────────────────────────────────────────────────────
  {
    name: "BCG",
    ageInWeeks: 0,
    description: "Bacillus Calmette-Guérin – protection against Tuberculosis",
    dose: "0.05 mL",
    route: "ID (Intradermal)",
    site: "Left upper arm",
    remarks: "Should be given as soon as possible after birth, ideally within 24 hours",
    sideEffects: [
      "Soreness or discharge at injection site",
      "High temperature",
      "Headache",
      "Swollen glands under the armpit on the vaccinated arm",
    ],
  },
  {
    name: "Hepatitis B (Birth dose)",
    ageInWeeks: 0,
    description: "Hepatitis B – first dose at birth",
    dose: "0.5 mL",
    route: "IM (Intramuscular)",
    site: "Left anterolateral thigh",
    remarks: "Mandatory before discharge; preferably within 24–72 hours of birth",
    sideEffects: [
      "Redness and soreness at injection site (rare)",
      "It is an inactivated (dead) vaccine, so it cannot cause the infection itself",
    ],
  },
  {
    name: "bOPV-0",
    ageInWeeks: 0,
    description: "Bivalent Oral Polio Vaccine – birth dose",
    dose: "2 drops",
    route: "Oral",
    remarks: "Zero dose; given at or shortly after birth",
    sideEffects: [
      "No common side effects associated with this vaccine",
    ],
  },

  // ── 6 Weeks ───────────────────────────────────────────────────────────
  {
    name: "bOPV-1",
    ageInWeeks: 6,
    description: "Bivalent Oral Polio Vaccine – 1st dose",
    dose: "2 drops",
    route: "Oral",
    sideEffects: [
      "No common side effects associated with this vaccine",
    ],
  },
  {
    name: "Pentavalent-1",
    ageInWeeks: 6,
    description: "DPT + Hepatitis B + Hib – 1st dose",
    dose: "0.5 mL",
    route: "IM (Intramuscular)",
    site: "Anterolateral thigh",
    remarks: "Combination vaccine; use combination vaccines whenever possible (IMA)",
    sideEffects: [
      "Swelling, redness and pain at injection site",
      "Fever for a short time after immunization",
      "Symptoms usually appear the next day and last 1–3 days",
    ],
  },
  {
    name: "fIPV-1",
    ageInWeeks: 6,
    description: "Fractional Inactivated Polio Vaccine – 1st dose",
    dose: "0.1 mL (fractional) / 0.5 mL (full)",
    route: "IM (Intramuscular)",
    site: "Anterolateral thigh",
    remarks: "NIS uses fractional IPV (fIPV); IMA recommends full-dose IPV",
    sideEffects: [
      "Soreness at injection site",
      "Fever",
    ],
  },
  {
    name: "Rotavirus-1",
    ageInWeeks: 6,
    description: "Rotavirus Vaccine (RVV) – 1st dose",
    dose: "0.5–2 mL (varies by brand)",
    route: "Oral",
    remarks: "First dose should not be given after 16 weeks of age",
    sideEffects: [
      "Side effects are rare and mild",
      "May include diarrhea, vomiting and irritation",
    ],
  },
  {
    name: "PCV-1",
    ageInWeeks: 6,
    description: "Pneumococcal Conjugate Vaccine – 1st dose",
    dose: "0.5 mL",
    route: "IM (Intramuscular)",
    site: "Anterolateral thigh",
    sideEffects: [
      "Redness, swelling, pain or tenderness at injection site",
      "Fever",
      "Loss of appetite",
      "Fussiness (irritability)",
      "Feeling tired",
      "Headache",
      "Muscle aches or joint pain",
    ],
  },

  // ── 10 Weeks ──────────────────────────────────────────────────────────
  {
    name: "bOPV-2",
    ageInWeeks: 10,
    description: "Bivalent Oral Polio Vaccine – 2nd dose",
    dose: "2 drops",
    route: "Oral",
    sideEffects: [
      "No common side effects associated with this vaccine",
    ],
  },
  {
    name: "Pentavalent-2",
    ageInWeeks: 10,
    description: "DPT + Hepatitis B + Hib – 2nd dose",
    dose: "0.5 mL",
    route: "IM (Intramuscular)",
    site: "Anterolateral thigh",
    sideEffects: [
      "Swelling, redness and pain at injection site",
      "Fever for a short time after immunization",
      "Symptoms usually appear the next day and last 1–3 days",
    ],
  },
  {
    name: "Rotavirus-2",
    ageInWeeks: 10,
    description: "Rotavirus Vaccine (RVV) – 2nd dose",
    dose: "0.5–2 mL (varies by brand)",
    route: "Oral",
    sideEffects: [
      "Side effects are rare and mild",
      "May include diarrhea, vomiting and irritation",
    ],
  },

  // ── 14 Weeks ──────────────────────────────────────────────────────────
  {
    name: "bOPV-3",
    ageInWeeks: 14,
    description: "Bivalent Oral Polio Vaccine – 3rd dose",
    dose: "2 drops",
    route: "Oral",
    sideEffects: [
      "No common side effects associated with this vaccine",
    ],
  },
  {
    name: "Pentavalent-3",
    ageInWeeks: 14,
    description: "DPT + Hepatitis B + Hib – 3rd dose",
    dose: "0.5 mL",
    route: "IM (Intramuscular)",
    site: "Anterolateral thigh",
    sideEffects: [
      "Swelling, redness and pain at injection site",
      "Fever for a short time after immunization",
      "Symptoms usually appear the next day and last 1–3 days",
    ],
  },
  {
    name: "fIPV-2",
    ageInWeeks: 14,
    description: "Fractional Inactivated Polio Vaccine – 2nd dose",
    dose: "0.1 mL (fractional) / 0.5 mL (full)",
    route: "IM (Intramuscular)",
    site: "Anterolateral thigh",
    sideEffects: [
      "Soreness at injection site",
      "Fever",
    ],
  },
  {
    name: "Rotavirus-3",
    ageInWeeks: 14,
    description: "Rotavirus Vaccine (RVV) – 3rd dose",
    dose: "0.5–2 mL (varies by brand)",
    route: "Oral",
    remarks: "3 doses for RV5/RV116E; 2 doses for RV1. Last dose not after 32 weeks (RV5) or 6 months (RV1)",
    sideEffects: [
      "Side effects are rare and mild",
      "May include diarrhea, vomiting and irritation",
    ],
  },
  {
    name: "PCV-2",
    ageInWeeks: 14,
    description: "Pneumococcal Conjugate Vaccine – 2nd dose",
    dose: "0.5 mL",
    route: "IM (Intramuscular)",
    site: "Anterolateral thigh",
    sideEffects: [
      "Redness, swelling, pain or tenderness at injection site",
      "Fever",
      "Loss of appetite",
      "Fussiness (irritability)",
      "Feeling tired",
      "Headache",
      "Muscle aches or joint pain",
    ],
  },

  // ── 9–12 Months ───────────────────────────────────────────────────────
  {
    name: "MR-1 / Measles-1",
    ageInWeeks: 39,
    description: "Measles-Rubella Vaccine – 1st dose",
    dose: "0.5 mL",
    route: "SC (Subcutaneous)",
    remarks: "Given after 270 completed days (≈ 9 months). IMA recommends MMR-1 at 9 months",
    sideEffects: [
      "Redness, swelling and sore feeling for 2–3 days",
      "7–11 days after injection: may feel unwell or develop a high temperature for 2–3 days",
    ],
  },
  {
    name: "fIPV-3",
    ageInWeeks: 39,
    description: "Fractional Inactivated Polio Vaccine – 3rd dose (NIS)",
    dose: "0.1 mL (fractional) / 0.5 mL (full)",
    route: "IM (Intramuscular)",
    remarks: "3rd dose of fIPV per NIS schedule at 9–12 months",
    sideEffects: [
      "Soreness at injection site",
      "Fever",
    ],
  },
  {
    name: "JE-1",
    ageInWeeks: 39,
    description: "Japanese Encephalitis Vaccine – 1st dose",
    dose: "0.25 mL",
    route: "IM (Intramuscular)",
    remarks: "Given in endemic districts only as per NIS; IMA recommends in endemic areas for children <3 years",
    sideEffects: [
      "Fever (rarely, more often in children)",
      "Headache or muscle aches (mainly in adults)",
      "Pain, tenderness, redness or swelling at injection site",
    ],
  },
  {
    name: "PCV Booster",
    ageInWeeks: 39,
    description: "Pneumococcal Conjugate Vaccine – Booster dose",
    dose: "0.5 mL",
    route: "IM (Intramuscular)",
    remarks: "Booster at 9–12 months per NIS; IMA recommends PCV booster at 15–18 months",
    sideEffects: [
      "Redness or swelling at injection site",
      "Loss of appetite",
      "Irritability",
      "Fever",
      "Increased crying",
    ],
  },
  {
    name: "Vitamin A (1st dose)",
    ageInWeeks: 39,
    description: "Vitamin A supplementation – 1st dose at 9 months",
    dose: "1 mL (100,000 IU)",
    route: "Oral",
    remarks: "First dose at 9 months with MR-1; subsequent doses every 6 months up to 5 years",
  },

  // ── 16–24 Months ──────────────────────────────────────────────────────
  {
    name: "MR-2 / Measles-2",
    ageInWeeks: 68,
    description: "Measles-Rubella Vaccine – 2nd dose",
    dose: "0.5 mL",
    route: "SC (Subcutaneous)",
    remarks: "Given at 16–24 months per NIS. IMA recommends MMR-2 at 15 months",
    sideEffects: [
      "Redness, swelling and sore feeling for 2–3 days at injection site",
      "7–11 days after injection: may feel unwell or develop a high temperature for 2–3 days",
    ],
  },
  {
    name: "JE-2",
    ageInWeeks: 68,
    description: "Japanese Encephalitis Vaccine – 2nd dose",
    dose: "0.25 mL",
    route: "IM (Intramuscular)",
    remarks: "Given in endemic districts only; at 16–24 months per NIS",
    sideEffects: [
      "Fever (rarely, more often in children)",
      "Headache or muscle aches (mainly in adults)",
      "Pain, tenderness, redness or swelling at injection site",
    ],
  },
  {
    name: "DPT Booster-1",
    ageInWeeks: 68,
    description: "Diphtheria-Pertussis-Tetanus – 1st Booster",
    dose: "0.5 mL",
    route: "IM (Intramuscular)",
    site: "Anterolateral thigh",
    remarks: "Given at 16–24 months per NIS; IMA recommends 16–18 months. Combination vaccines preferred",
    sideEffects: [
      "Soreness or swelling at injection site",
      "Fever",
      "Irritation",
      "Exhaustion",
      "Loss of appetite",
      "Vomiting",
    ],
  },
  {
    name: "bOPV Booster",
    ageInWeeks: 68,
    description: "Bivalent Oral Polio Vaccine – Booster dose",
    dose: "2 drops",
    route: "Oral",
    remarks: "Booster at 16–24 months per NIS",
    sideEffects: [
      "No common side effects associated with this vaccine",
    ],
  },
  {
    name: "Vitamin A (2nd–9th dose)",
    ageInWeeks: 68,
    description: "Vitamin A supplementation – every 6 months up to 5 years",
    dose: "2 mL (200,000 IU)",
    route: "Oral",
    remarks: "One dose every 6 months from 16 months up to 5 years of age",
  },

  // ── 5–6 Years ─────────────────────────────────────────────────────────
  {
    name: "DPT Booster-2",
    ageInWeeks: 260,
    description: "Diphtheria-Pertussis-Tetanus – 2nd Booster",
    dose: "0.5 mL",
    route: "IM (Intramuscular)",
    remarks: "Given at 5–6 years per NIS. IMA recommends DTwP/DTaP/Tdap at 4–6 years",
    sideEffects: [
      "Soreness or swelling at injection site",
      "Fever",
      "Irritation",
      "Exhaustion",
      "Loss of appetite",
      "Vomiting",
    ],
  },

  // ── 10 Years ──────────────────────────────────────────────────────────
  {
    name: "Td",
    ageInWeeks: 520,
    description: "Tetanus & adult Diphtheria – 10 years",
    dose: "0.5 mL",
    route: "IM (Intramuscular)",
    remarks: "Tdap preferred over Td (IMA). Repeat every 10 years",
    sideEffects: [
      "Pain, redness or swelling at injection site",
      "Mild fever",
      "Headache",
      "Exhaustion",
      "Nausea, vomiting, diarrhea or stomach ache",
    ],
  },

  // ── 16 Years ──────────────────────────────────────────────────────────
  {
    name: "Td (16 years)",
    ageInWeeks: 832,
    description: "Tetanus & adult Diphtheria – 16 years",
    dose: "0.5 mL",
    route: "IM (Intramuscular)",
    remarks: "Repeat every 10 years thereafter",
    sideEffects: [
      "Pain, redness or swelling at injection site",
      "Mild fever",
      "Headache",
      "Exhaustion",
      "Nausea, vomiting, diarrhea or stomach ache",
    ],
  },
];

/** Reference links for parents. */
export const immunizationReferenceLinks = [
  {
    title: "UNICEF India – Know Your Child's Immunization Schedule",
    url: "https://www.unicef.org/india/know-your-childs-immunization-schedule",
  },
  {
    title: "National Immunization Schedule (NIS) – India",
    url: "https://prod-cdn.preprod.co-vin.in/uwin-prod/pdf/National+Immunization+Schedule+(NIS)+for+SRM.pdf",
  },
  {
    title: "IMA – Immunization Schedule Chart (PDF)",
    url: "https://ima-india.org/ima/pdfdata/Immunization_Schedule_CHART.pdf",
  },
];

export function getVaccineDueDate(dateOfBirth: string, ageInWeeks: number): string {
  const dob = new Date(dateOfBirth);
  const dueDate = new Date(dob.getTime() + ageInWeeks * 7 * 24 * 60 * 60 * 1000);
  return dueDate.toISOString().split("T")[0];
}
