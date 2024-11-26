import { z } from 'zod';
import { Availability } from '../domain/booking';

export const bookingSchema = z.object({
  bookingDate: z.date(),
  bookingAvailability: z.nativeEnum(Availability),
  bookingAnnotations: z.string().optional(),
  userId: z.number(),
  serviceId: z.number(),
  siteId: z.number(),
  appointmentId: z.number(),
  paymentId: z.number(),
});

export type BookingSchema = z.infer<typeof bookingSchema>;