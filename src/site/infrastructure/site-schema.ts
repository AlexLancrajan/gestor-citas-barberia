import { z } from 'zod';

export const siteSchema = z.object({
  siteName: z.string({ message: "Site Name format error." }).trim()
    .min(1, "Site name should not be empty"),
  siteDirection: z.string({ message: "Site Direction format error." }).trim()
    .min(1, "Site direction should not be empty"),
  siteSchedule: z.string({ message: "Site Schedule format error." }).trim()
    .min(1, "Site schedule should not be empty"),
  sitePhone: z.string({ message: "Site Phone format error." }).trim()
    .min(9, { message: "Phone should be at least 9 characters long" })
    .max(15, { message: "Phone should not exceed 15 characters" }),
  siteDescription: z.string({ message: "Site Description format error" }).trim()
    .min(1, "Site description should not be empty"),
}).strict();

export const siteModificationSchema = z.object({
  siteName: z.string({ message: "Site Name format error." }).trim()
    .min(1, "Site name should not be empty")
    .optional(),
  siteDirection: z.string({ message: "Site Direction format error." }).trim()
    .min(1, "Site direction should not be empty")
    .optional(),
  siteSchedule: z.string({ message: "Site Schedule format error." }).trim()
    .min(1, "Site schedule should not be empty")
    .optional(),
  sitePhone: z.string({ message: "Site Phone format error." }).trim()
    .min(9, { message: "Phone should be at least 9 characters long" })
    .max(15, { message: "Phone should not exceed 15 characters" })
    .optional(),
  siteDescription: z.string({ message: "Site Description format error" }).trim()
    .min(1, "Site description should not be empty")
    .optional(),
}).strict();

export type SiteSchema = z.infer<typeof siteSchema>;
export type SiteModificationSchema = 
z.infer<typeof siteModificationSchema>;
