import { z } from 'zod';
import { Availability } from '../../booking/domain/booking';

export const dateInputSchema = z.object({
  dateDate: z.date(),
  dateAvailability: z.nativeEnum(Availability),
  dateSiteIdRef: z.number(),
});

export const dateNoAvailabilitySchema = z.object({
  dateDate: z.date(),
  dateSiteIdRef: z.number(),
});

export const dateModificationSchema = z.object({
  dateDate: z.date().optional(),
  dateAvailability: z.nativeEnum(Availability).optional(),
  dateSiteIdRef: z.number().optional(),
});

export const siteIdRefSchema = z.object({
  siteIdRef: z.number()}
);


export const occupationDatesSchema = z.object({
  siteIdRef: z.number(),
  initDate: z.date(),
  endDate: z.date(),
});

export const dailyDatesSchema = z.object({
  siteIdRef: z.number(),
  schedule: z.array(z.object({
    initDate: z.date(),
    endDate: z.date(),
  })),
  minutes: z.number()
});

export const automaticDatesSchema = z.object({
  initDate: z.date(),
  months: z.number(),
  schedule: z.array(z.object({
    initDate: z.date(),
    endDate: z.date(),
  })),
  minutes: z.number(),
  siteIdRef: z.number(),
});

export type DateInputSchema = z.infer<typeof dateInputSchema>;
export type DateNoAvailabilitySchema = z.infer<typeof dateNoAvailabilitySchema>;
export type DateModificationSchema = z.infer<typeof dateModificationSchema>;
export type SiteIdRefSchema = z.infer<typeof siteIdRefSchema>;
export type OccupationDatesSchema = z.infer<typeof occupationDatesSchema>;
export type DailyDatesSchema = z.infer<typeof dailyDatesSchema>;
export type AutomaticDatesSchema = z.infer<typeof automaticDatesSchema>;