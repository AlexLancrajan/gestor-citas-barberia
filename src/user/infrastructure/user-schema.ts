import { z } from 'zod';
import { Roles } from '../domain/user';

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(20, { message: "Password cannot exceed 20 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character (@$!%*?&#)" });

export const userGoogleRegistrationSchema = z.object({
  userId: z.string().trim(),
  username: z.string().trim()
    .min(5, 'Username too short, must be at least 5 characters long'),
  password: passwordSchema,
  email: z.string().trim().email(),
  phone: z.string().trim().min(9, 'Invalid phone format'),
  name: z.string().trim().optional(),
  surname: z.string().trim().optional(),
  role: z.nativeEnum(Roles),
  missingTrack: z.number().optional(),
}).strict();

export const userRegistrationSchema = z.object({
  username: z.string().trim()
    .min(5, 'Username too short, must be at least 5 characters long'),
  password: passwordSchema,
  email: z.string().trim().email(),
  phone: z.string().trim().min(9, 'Invalid phone format'),
  name: z.string().trim().optional(),
  surname: z.string().trim().optional(),
  role: z.nativeEnum(Roles),
  missingTrack: z.number().optional(),
}).strict();

export const userLoginSchema = z.object({
  username: z.string(),
  password: passwordSchema,
}).strict();

export const userModificationsSchema = z.object({
  username: z.string().trim()
  .min(5, 'Username too short, must be at least 5 characters long')
  .optional(),
  password: passwordSchema.optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().min(9, 'Invalid phone format').optional(),
  name: z.string().trim().optional(),
  surname: z.string().trim().optional(),
  role: z.nativeEnum(Roles).optional(),
  missingTrack: z.number().optional(),
}).strict();

export type UserGoogleRegistrationSchema = z.infer<typeof userGoogleRegistrationSchema>;
export type UserRegistrationSchema = z.infer<typeof userRegistrationSchema>;
export type UserLoginSchema = z.infer<typeof userLoginSchema>;
export type UserModificationsSchema = z.infer<typeof userModificationsSchema>;