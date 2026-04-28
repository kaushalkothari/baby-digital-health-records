/**
 * BabyBloomCare
 * Copyright (c) 2026 Kaushal Kothari. All rights reserved.
 * Unauthorized copying, modification or distribution
 * of this software is strictly prohibited.
 */

import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";

function numEnv(value: string | undefined, fallback: number): number {
  if (value === undefined || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  const environment =
    import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE;

  Sentry.init({
    dsn,
    environment,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: import.meta.env.PROD
      ? numEnv(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE_PROD, 0.2)
      : 1,
    replaysSessionSampleRate: numEnv(
      import.meta.env.VITE_SENTRY_REPLAY_SESSION_SAMPLE_RATE,
      0.1,
    ),
    replaysOnErrorSampleRate: numEnv(
      import.meta.env.VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE,
      1,
    ),
  });
}
