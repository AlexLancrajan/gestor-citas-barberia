import { z } from 'zod';
import { Availability } from '../domain/booking';

export const bookingPaymentInputSchema = z.object({
  bookingDate: z.date(),
  bookingAvailability: z.nativeEnum(Availability),
  bookingAnnotations: z.string().optional(),
  bookingTransactionId: z.string().trim(),
  bookingPaymentDate: z.date(),
  bookingPrice: z.number(),
  userIdRef: z.number(),
  siteIdRef: z.number(),
  serviceIdRef: z.number(),
});

export const bookingNoPaymentInputSchema = z.object({
  bookingDate: z.date(),
  bookingAvailability: z.nativeEnum(Availability),
  bookingAnnotations: z.string().optional(),
  bookingTransactionId: z.string().trim().optional(),
  bookingPaymentDate: z.date().optional(),
  bookingPrice: z.number().optional(),
  userIdRef: z.number(),
  siteIdRef: z.number(),
  serviceIdRef: z.number(),
});

export const bookingQuerySchema = z.object({
  bookingDate: z.date().optional(),
  bookingUserId: z.number().optional(),
  bookingSiteId: z.number().optional(),
  bookingServiceId: z.number().optional(),
  getUsers: z.boolean().optional(),
  getSites: z.boolean().optional(),
  getServices: z.boolean().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
});

export const bookingQueryUserSchema = z.object({
  bookingUserId: z.number().optional(),
  getUser: z.boolean().optional(),
  getSite: z.boolean().optional(),
  getService: z.boolean().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
});

export const paymentSchema = z.object({
  amount: z.number(),
  currency: z.string().trim(),
  description: z.string().trim(),
});

export const refundPaymentSchema = z.object({
  paymentIntentId: z.string(),
  amount: z.number().optional(),
});


export type BookingPaymentInputSchema = z.infer<typeof bookingPaymentInputSchema>;

export type BookingNoPaymentInputSchema = 
z.infer<typeof bookingNoPaymentInputSchema>;

export type BookingQuerySchema = z.infer<typeof bookingQuerySchema>;

export type BookingQueryUserSchema = z.infer<typeof bookingQueryUserSchema>;

export type PaymentSchema = z.infer<typeof paymentSchema>;

export type RefundPaymentSchema = z.infer<typeof refundPaymentSchema>;