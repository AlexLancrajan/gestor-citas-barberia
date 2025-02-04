import { z } from 'zod';
import { Availability } from '../../date/domain/date';

const parseDate = z.preprocess((arg) => {
  if (typeof arg === "string") {
    const date = new Date(arg);
    return date; // Convert ISO string to Date
  }
  return arg; // Return as is if it's already a Date
}, z.date());

export const dateInputSchema = z.array(
  z.object({
    dateDate: parseDate,
    dateAvailability: z.nativeEnum(Availability),
    siteId: z.number(),
  }).strict()
);

export const dateNoAvailabilitySchema = z.object({
  dateDate: parseDate,
  siteId: z.number(),
}).strict();

export const dateModificationSchema = z.object({
  dateDate: parseDate.optional(),
  dateAvailability: z.nativeEnum(Availability).optional(),
  siteId: z.number().optional(),
}).strict();

export const occupationDatesSchema = z.object({
  siteId: z.number(),
  initDate: parseDate,
  endDate: parseDate,
}).strict();

export const dailyDatesSchema = z.object({
  siteId: z.number(),
  schedule: z.array(z.object({
    initDate: parseDate,
    endDate: parseDate,
  })),
  minutes: z.number()
}).strict();

export const automaticDatesSchema = z.object({
  initDate: parseDate.optional(),
  months: z.number().optional(),
  schedule: z.array(z.object({
    initDate: parseDate,
    endDate: parseDate,
  })),
  minutes: z.number().optional(),
  siteId: z.number(),
}).strict();

export type DateInputSchema = z.infer<typeof dateInputSchema>;
export type DateNoAvailabilitySchema = z.infer<typeof dateNoAvailabilitySchema>;
export type DateModificationSchema = z.infer<typeof dateModificationSchema>;
export type OccupationDatesSchema = z.infer<typeof occupationDatesSchema>;
export type DailyDatesSchema = z.infer<typeof dailyDatesSchema>;
export type AutomaticDatesSchema = z.infer<typeof automaticDatesSchema>;