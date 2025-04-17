import { z } from "zod";


export const barberInputSchema = z.object({
  barberName: z.string({ message: "Barber Name format error." }).trim()
    .min(2, "Barber Name should be at least 2 characters long."),
  barberSurname: z.string({ message: "Barber Surname format error." }).trim()
    .min(2, "Barber Surname should be at least 2 characters long."),
  barberPicture: z.string({ message: "Barber Picture format error." }).trim(),
  barberDescription: z.string({ message: "Barber Description format error." }).trim()
    .min(1, "Barber Description should not be empty."),
  siteId: z.number({ message: "Site Id format error." })
}).strict();

export const barberModificationSchema = z.object({
  barberName: z.string({ message: "Barber Name format error." }).trim()
    .min(2, "Barber Name should be at least 2 characters long.")
    .optional(),
  barberSurname: z.string({ message: "Barber Surname format error." }).trim()
    .min(2, "Barber Surname should be at least 2 characters long.")
    .optional(),
  barberPicture: z.string({ message: "Barber Picture format error." }).trim()
  .optional(),
  barberDescription: z.string({ message: "Barber Description format error." }).trim()
    .min(1, "Barber Description should not be empty.")
    .optional(),
  siteId: z.number({ message: "Site Id format error." })
  .optional()
}).strict();

export type BarberInputSchema = z.infer<typeof barberInputSchema>;
export type BarberModificationSchema = z.infer<typeof barberModificationSchema>;