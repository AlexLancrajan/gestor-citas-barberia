import { z } from 'zod';
import { Availability } from '../../date/domain/date';

const parseDate = z.preprocess((arg) => {
  if (typeof arg === "string") {
    const date = new Date(arg);
    return isNaN(date.getTime()) ? arg : date;
  }
  return arg;
}, z.any())
.refine(
    (val) => val instanceof Date && !isNaN(val.getTime()),
    (val) => (
      {
        message: `Invalid date: ${JSON.stringify(val)}`
      }
    )
)
.transform((val) => val as Date);

export const dateInputSchema = z.array(
  z.object({
    dateDate: parseDate,
    dateAvailability: z.nativeEnum(Availability),
    siteId: z.number({ message: "Site id format error." }),
  }).strict()
);

export const dateNoAvailabilitySchema = z.object({
  dateDate: parseDate,
  siteId: z.number({ message: "Site id format error." }),
}).strict();

export const dateModificationSchema = z.object({
  dateDate: parseDate.optional(),
  dateAvailability: z.nativeEnum(Availability).optional(),
  siteId: z.number({ message: "Site id format error. "}).optional(),
}).strict();

export const occupationDatesSchema = z.object({
  siteId: z.number({ message: "Site id format error." }),
  openTime: parseDate,
  closeTime: parseDate,
}).strict();

export const dailyDatesSchema = z.object({
  siteId: z.number({ message: "Site id format error." }),
  schedule: z.array(z.object({
    openTime: parseDate,
    closeTime: parseDate,
  })),
  minutes: z.number({ message: "minutes format error." })
  .gt(0, { message: "Should add more than 0 minutes."})
}).strict();

export const automaticDatesSchema = z.object({
  initDate: parseDate.optional(),
  months: z.number({ message: "Months format error."})
    .gt(0, { message: "It should be at least 1 month." })
    .optional(),
  schedule: z.array(z.object({
    openTime: parseDate,
    closeTime: parseDate,
  })),
  minutes: z.number({ message: "minutes format error." })
    .gt(0, { message: "It should be added more than 0 minutes."})
    .optional(),
  siteId: z.number({ message: "Site id format error." }),
}).strict();

export type DateInputSchema = z.infer<typeof dateInputSchema>;
export type DateNoAvailabilitySchema = z.infer<typeof dateNoAvailabilitySchema>;
export type DateModificationSchema = z.infer<typeof dateModificationSchema>;
export type OccupationDatesSchema = z.infer<typeof occupationDatesSchema>;
export type DailyDatesSchema = z.infer<typeof dailyDatesSchema>;
export type AutomaticDatesSchema = z.infer<typeof automaticDatesSchema>;