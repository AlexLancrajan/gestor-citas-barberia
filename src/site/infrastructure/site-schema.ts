import { z } from 'zod';

export const siteSchema = z.object({
  name: z.string(),
  direction: z.string(),
  schedule: z.date(),
  description: z.string().optional(),
});

export type SiteSchema = z.infer<typeof siteSchema>;
