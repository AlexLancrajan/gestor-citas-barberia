import { z } from 'zod';

export const serviceSchema = z.object({
  serviceType: z.string({ message: "Service Type format error" }).trim()
    .min(1, { message: "Service type must not be empty"}),
  servicePrice: z.number()
    .gte(0, { message: "Price can not be negative."}),
  serviceDuration: z.preprocess((arg) => {
    if (typeof arg === "string") {
      return new Date(arg); // Convert ISO string to Date
    }
    return arg; // Return as is if it's already a Date
  }, z.date({ message: "Date format error."})),
  serviceDescription: z.string().trim()
    .min(1, { message: "Service type must not be empty"}),
  siteId: z.number({ message: "Error on site id format." })
}).strict();

export const serviceModificationSchema = z.object({
  serviceType: z.string({ message: "Service Type format error." }).trim()
    .min(1, { message: "Service type must not be empty"})
    .optional(),
  servicePrice: z.preprocess((arg) => {
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
  .transform((val) => val as Date),
  serviceDescription: z.string().trim()
    .min(1, { message: "Service type must not be empty"})
    .optional(),
  siteId: z.number({  message: "Error on site id format." }).optional()
}).strict();

export type ServiceSchema = z.infer<typeof serviceSchema>;
export type ServiceModificationSchema = z.infer<typeof serviceModificationSchema>;
