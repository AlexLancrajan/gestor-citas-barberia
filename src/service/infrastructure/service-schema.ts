import { z } from 'zod';

export const serviceSchema = z.object({
  type: z.string(),
  price: z.number(),
  duration: z.date(),
  description: z.string(),
});

export type ServiceSchema = z.infer<typeof serviceSchema>;
