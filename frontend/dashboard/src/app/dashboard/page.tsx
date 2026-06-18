/**
 * Dashboard route — a React Server Component. Do **not** add `'use client'`.
 *
 * Responsible for page layout and composition only: no `fetch()` or polling here.
 * Import chart and widget Client Components and arrange them on the page.
 *
 * Suggested layout: summary cards on top, main charts in the middle, comparison and alerts below.
 */

import { DashboardContainer } from "@/components/dashboard/DashboardContainer";

export default function DashboardPage() {
  return <DashboardContainer />;
}
