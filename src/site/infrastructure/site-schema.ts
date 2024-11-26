import { z } from 'zod';

export const siteSchema = z.object({
  siteName: z.string(),
  siteDirection: z.string(),
  siteSchedule: z.array(z.object({
    day: z.string(),
    schedule: z.array(z.date())
  })),
  siteDescription: z.string().optional(),
});

export type SiteSchema = z.infer<typeof siteSchema>;
