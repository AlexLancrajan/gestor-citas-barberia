import { z } from 'zod';

const parseDate = z.preprocess((arg) => {
  if (typeof arg === "string") {
    const date = new Date(arg);
    return date; // Convert ISO string to Date
  }
  return arg; // Return as is if it's already a Date
}, z.date());

export const bookingPaymentInputSchema = z.object({
  bookingDate: parseDate,
  bookingAnnotations: z.string().optional(),
  bookingTransactionId: z.string().trim(),
  bookingPaymentDate: parseDate,
  bookingPrice: z.number(),
  userId: z.string().trim(),
  siteId: z.number(),
  serviceId: z.number(),
}).strict();

export const bookingNoPaymentInputSchema = z.object({
  bookingDate: parseDate,
  bookingAnnotations: z.string().optional(),
  userId: z.string().trim(),
  siteId: z.number(),
  serviceId: z.number(),
}).strict();

export const bookingModificationSchema = z.object({
  bookingDate: parseDate,
  bookingAnnotations: z.string().optional(),
  bookingTranscationId: z.string().trim().optional(),
  bookingPaymentDate: parseDate.optional(),
  bookingPrice: z.number().optional(),
  serviceId: z.number().optional(),
}).strict();

export const bookingQueryAdminSchema = z.object({
  bookingDate: parseDate.optional(),
  userId: z.string().trim().optional(),
  siteId: z.number().optional(),
  serviceId: z.number().optional(),
  getUsers: z.boolean().optional(),
  getSites: z.boolean().optional(),
  getServices: z.boolean().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
}).strict();

export const bookingQueryUserSchema = z.object({
  userId: z.string().trim().optional(),
  getUser: z.boolean().optional(),
  getSite: z.boolean().optional(),
  getService: z.boolean().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
}).strict();

export const paymentSchema = z.object({
  amount: z.number(),
  currency: z.string().trim(),
  description: z.string().trim(),
}).strict();

export const refundPaymentSchema = z.object({
  paymentIntentId: z.string(),
  amount: z.number().optional(),
}).strict();


export type BookingPaymentInputSchema = z.infer<typeof bookingPaymentInputSchema>;

export type BookingNoPaymentInputSchema = 
z.infer<typeof bookingNoPaymentInputSchema>;

export type BookingModificationSchema = z.infer<typeof bookingModificationSchema>;

export type BookingQueryAdminSchema = z.infer<typeof bookingQueryAdminSchema>;

export type BookingQueryUserSchema = z.infer<typeof bookingQueryUserSchema>;

export type PaymentSchema = z.infer<typeof paymentSchema>;

export type RefundPaymentSchema = z.infer<typeof refundPaymentSchema>;