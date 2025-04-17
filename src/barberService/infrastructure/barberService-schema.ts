import { z } from "zod";

export const barberServiceSchema = z.object({
  barberId: z.string({ message: "Barber Id format error." }).trim().optional(),
  serviceId: z.number({ message: "Service Id format error." }).optional()
}).strict();

export const createBarberServiceSchema = z.object({
  barberId: z.string({ message: "Barber Id format error." }).trim(),
  serviceId: z.number({ message: "Service Id format error." })
}).strict();

export type BarberServiceSchema = z.infer<typeof barberServiceSchema>;
export type CreateBarberServiceSchema = z.infer<typeof createBarberServiceSchema>;