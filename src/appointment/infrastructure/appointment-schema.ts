import { z } from 'zod';
import { Availability } from '../../booking/domain/booking';

export const appointmentSchema = z.object({
  appointmentId: z.number(),
  appointmentDate: z.date(),
  appointmentDisponibility: z.nativeEnum(Availability)
});

export const dateSchema = z.object({
  date: z.date(),
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;