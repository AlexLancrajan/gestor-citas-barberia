import { z } from "zod";

export const barberServiceSchema = z.object({
  barberId: z.string().trim().optional(),
  serviceId: z.number().optional()
}).strict();

export const createBarberServiceSchema = z.object({
  barberId: z.string().trim(),
  serviceId: z.number()
}).strict();

export type BarberServiceSchema = z.infer<typeof barberServiceSchema>;
export type CreateBarberServiceSchema = z.infer<typeof createBarberServiceSchema>;