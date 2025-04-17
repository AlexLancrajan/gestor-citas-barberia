import { z } from 'zod';
import { Roles } from '../domain/user';

const passwordSchema = z
  .string({ message: "Password format error." })
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(20, { message: "Password cannot exceed 20 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character (@$!%*?&#)" });

export const userRegistrationSchema = z.object({
  username: z.string({ message: "Username format error." }).trim()
    .min(5, 'Username too short, must be at least 5 characters long'),
  password: passwordSchema,
  email: z.string().trim()
    .email({ message: "Invalid email format."}),
  phone: z.string({ message: "Phone format error." }).trim()
    .min(9, "Phone number must be at least 9 characters long.")
    .max(15, "Exceeded maximum size of phone number: 15"),
  name: z.string({ message: "Name format error." }).trim()
    .min(2, "Name should be at least 2 characters long")
    .optional(),
  surname: z.string({ message: "Surname format error." }).trim()
    .min(2, "Name should be at least 2 characters long")
    .optional(),
  role: z.nativeEnum(Roles),
  missingTrack: z.number({ message: "Missing Track format error." }).optional(),
}).strict();

export const userLoginSchema = z.object({
  username: z.string({ message: "Username format error." }).trim()
    .min(5, 'Username too short, must be at least 5 characters long'),
  password: passwordSchema,
}).strict();

export const userModificationsSchema = z.object({
  username: z.string({ message: "Username format error." }).trim()
    .min(5, 'Username too short, must be at least 5 characters long')
    .optional(),
  password: passwordSchema.optional(),
  email: z.string().trim()
    .email({ message: "Invalid email format."})
    .optional(),
  phone: z.string({ message: "Phone format error." }).trim()
    .min(9, "Phone number must be at least 9 characters long.")
    .max(15, "Exceeded maximum size of phone number: 15")
    .optional(),
  name: z.string({ message: "Name format error." }).trim()
    .min(2, "Name should be at least 2 characters long")
    .optional(),
  surname: z.string({ message: "Surname format error." }).trim()
    .min(2, "Name should be at least 2 characters long")
    .optional(),
  role: z.nativeEnum(Roles).optional(),
  missingTrack: z.number({ message: "Missing Track format error." }).optional(),
}).strict();

export type UserRegistrationSchema = z.infer<typeof userRegistrationSchema>;
export type UserLoginSchema = z.infer<typeof userLoginSchema>;
export type UserModificationsSchema = z.infer<typeof userModificationsSchema>;