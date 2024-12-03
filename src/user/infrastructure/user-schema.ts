import { z } from 'zod';
import { Roles } from '../domain/user';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&_])[A-Za-z\d@.#$!%*?&_]{6,}$/;

export const userGoogleRegistrationSchema = z.object({
  userId: z.string().trim(),
  username: z.string().trim()
    .min(5, 'Username too short, must be at least 5 characters long'),
  password: z.string().trim().regex(passwordRegex),
  email: z.string().trim().email(),
  phone: z.string().trim().min(9, 'Invalid phone format'),
  name: z.string().trim().optional(),
  surname: z.string().trim().optional(),
  role: z.nativeEnum(Roles),
  missingTrack: z.number().optional(),
});

export const userRegistrationSchema = z.object({
  username: z.string().trim()
    .min(5, 'Username too short, must be at least 5 characters long'),
  password: z.string().trim().regex(passwordRegex),
  email: z.string().trim().email(),
  phone: z.string().trim().min(9, 'Invalid phone format'),
  name: z.string().trim().optional(),
  surname: z.string().trim().optional(),
  role: z.nativeEnum(Roles),
  missingTrack: z.number().optional(),
});

export const userLoginSchema = z.object({
  username: z.string(),
  password: z.string().regex(passwordRegex),
});

export const userModificationsSchema = z.object({
  username: z.string().trim()
  .min(5, 'Username too short, must be at least 5 characters long')
  .optional(),
  password: z.string().trim().regex(passwordRegex).optional(),
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