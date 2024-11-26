import { z } from 'zod';
import { Availability } from '../../booking/domain/booking';

export const appointmentSchema = z.object({
  appointmentId: z.number(),
  appointmentDate: z.date(),
  appointmentAvailability: z.nativeEnum(Availability),
  siteId: z.number(),
});

export const dateSchema = z.object({
  date: z.date(),
});

export const appointmentDateSchema = z.object({
  initDate: z.date(),
  endDate: z.date(),
  minutes: z.number(),
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;
export type DateSchema = z.infer<typeof dateSchema>;
export type AppointmentDateSchema = z.infer<typeof appointmentDateSchema>;