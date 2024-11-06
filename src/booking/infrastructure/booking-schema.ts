import { z } from 'zod';
import { Availability } from '../domain/booking';

export const bookingSchema = z.object({
  bookingDate: z.date(),
  disponibility: z.nativeEnum(Availability),
  annotations: z.string().optional(),
  userIdRef: z.number(),
  serviceIdRef: z.number(),
  siteIdRef: z.number(),
});

export type BookingSchema = z.infer<typeof bookingSchema>;