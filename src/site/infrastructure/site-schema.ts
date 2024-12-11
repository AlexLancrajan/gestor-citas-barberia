import { z } from 'zod';

export const siteSchema = z.object({
  siteName: z.string().trim(),
  siteDirection: z.string().trim(),
  siteSchedule: z.string().trim(),
  sitePhone: z.string().trim(),
  siteDescription: z.string().trim(),
}).strict();

export const siteModificationSchema = z.object({
  siteName: z.string().trim().optional(),
  siteDirection: z.string().trim().optional(),
  siteSchedule: z.string().trim().optional(),
  sitePhone: z.string().trim().optional(),
  siteDescription: z.string().optional(),
}).strict();

export type SiteSchema = z.infer<typeof siteSchema>;
export type SiteModificationSchema = 
z.infer<typeof siteModificationSchema>;
