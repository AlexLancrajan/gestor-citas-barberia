import { z } from 'zod';

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

export const bookingNoPaymentInputSchema = z.object({
  bookingDate: parseDate,
  bookingAnnotations: z.string().optional(),
  userId: z.string({ message: "User Id format error." }).trim(),
  siteId: z.number({ message: "Site Id format error." }),
  serviceId: z.number({ message: "Service Id format error." }),
}).strict();

export const bookingPaymentInputSchema = z.object({
  bookingDate: parseDate,
  bookingAnnotations: z.string().optional(),
  amount: z.number({ message: "Amount format error." })
    .gte(0, "Must be a positive number" ),
  currency: z.string({ message: "Currency format error." }).trim(),
  description: z.string({ message: "Description format error" }).trim(),
  userId: z.string({ message: "User Id format error." }).trim(),
  siteId: z.number({ message: "Site Id format error." }),
  serviceId: z.number({ message: "Service Id format error." }),
}).strict();

export const bookingModificationSchema = z.object({
  bookingDate: parseDate,
  bookingAnnotations: z.string().optional(),
  bookingTranscationId: z.string({ message: "Transaction Id format error." }).trim().optional(),
  bookingPaymentDate: parseDate.optional(),
  bookingPrice: z.number({ message: "Booking Price format error." })
    .gte(0, "Must be a positive number or 0." )
    .optional(),
  serviceId: z.number({ message: "Service Id format error." }).optional(),
}).strict();

export const bookingQueryAdminSchema = z.object({
  bookingDate: parseDate.optional(),
  userId: z.string({ message: "User Id format error." }).trim().optional(),
  siteId: z.number({ message: "Site Id format error." }).optional(),
  serviceId: z.number({ message: "Service Id format error." }).optional(),
  getUsers: z.boolean({ message: "getUsers format error." }).optional(),
  getSites: z.boolean({ message: "getSites format error." }).optional(),
  getServices: z.boolean({ message: "getServices format error." }).optional(),
  page: z.number({ message: "Page format error." })
    .gte(0, "Must be a positive number or 0.")
    .optional(),
  pageSize: z.number({ message: "PageSize format error." })
    .gte(0, "Must be a positive number or 0.")
    .optional(),
}).strict();

export const bookingQueryUserSchema = z.object({
  userId: z.string({ message: "User Id format error." }).trim().optional(),
  getUser: z.boolean({ message: "getUser format error." }).optional(),
  getSite: z.boolean({ message: "getSite format error." }).optional(),
  getService: z.boolean({ message: "getService format error." }).optional(),
  page: z.number({ message: "Page format error." })
    .gte(0, "Must be a positive number or 0.")
    .optional(),
  pageSize: z.number({ message: "PageSize format error." })
    .gte(0, "Must be a positive number or 0.")
    .optional(),
}).strict();

export const paymentSchema = z.object({
  amount: z.number({ message: "Amount format error." })
    .gte(0, "Must be a positive number" ),
  currency: z.string({ message: "Currency format error." }).trim(),
  description: z.string({ message: "Description format error" }).trim(),
  bookingId: z.string({ message: "Booking Id format error" }).trim(),
}).strict();

export const refundPaymentSchema = z.object({
  paymentIntentId: z.string({ message: "Payment Intent Id format error" }),
  amount: z.number({ message: "Amount format error." })
    .gte(0, "Must be a positive number" )
    .optional(),
}).strict();

export type BookingNoPaymentInputSchema = 
z.infer<typeof bookingNoPaymentInputSchema>;

export type BookingPaymentInputSchema = 
z.infer<typeof bookingPaymentInputSchema>;

export type BookingModificationSchema = z.infer<typeof bookingModificationSchema>;

export type BookingQueryAdminSchema = z.infer<typeof bookingQueryAdminSchema>;

export type BookingQueryUserSchema = z.infer<typeof bookingQueryUserSchema>;

export type PaymentSchema = z.infer<typeof paymentSchema>;

export type RefundPaymentSchema = z.infer<typeof refundPaymentSchema>;