import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&_])[A-Za-z\d@.#$!%*?&_]{6,}$/;

export const userRegistrationSchema = z.object({
  username: z.string().trim().min(4, 'Username too short, must be at least 4 characters long'),
  password: z.string().regex(passwordRegex),
  email: z.string().email(),
  phone: z.string().min(9, 'Invalid phone format'),
  name: z.string().optional(),
  surname: z.string().optional(),
  role: z.enum(['admin', 'barber', 'user'])
});

export type UserRegistrationSchema = z.infer<typeof userRegistrationSchema>;

export const userModificationSchema = z.object({
  username: z.string().trim().min(4, 'Username too short, must be at least 4 characters long'),
  password: z.string().regex(passwordRegex).optional(),
  email: z.string().email(),
  phone: z.string().min(9, 'Invalid phone format'),
  name: z.string().optional(),
  surname: z.string().optional(),
  role: z.enum(['admin', 'barber', 'user'])
});

export type UserModificationSchema = z.infer<typeof userModificationSchema>;

export const userLoginSchema = z.object({
  username: z.string(),
  password: z.string().regex(passwordRegex),
});
export type UserLoginSchema = z.infer<typeof userLoginSchema>;