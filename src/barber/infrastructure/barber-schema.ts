import { z } from "zod";


export const barberInputSchema = z.object({
  barberName: z.string().trim(),
  barberSurname: z.string().trim(),
  barberPicture: z.string().trim(),
  barberDescription: z.string().trim(),
  siteId: z.number()
}).strict();

export const barberModificationSchema = z.object({
  barberName: z.string().trim().optional(),
  barberSurname: z.string().trim().optional(),
  barberPicture: z.string().trim().optional(),
  barberDescription: z.string().trim().optional(),
  siteId: z.number().optional()
}).strict();

export type BarberInputSchema = z.infer<typeof barberInputSchema>;
export type BarberModificationSchema = z.infer<typeof barberModificationSchema>;