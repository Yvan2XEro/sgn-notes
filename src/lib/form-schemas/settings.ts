import z from "zod";
export const TranscriptsettingsSchema = z.object({
  referenceNumber: z.string().min(1, "Le numéro de référence est requis"),
  nameFrench: z.string().min(1, "Le nom en français est requis"),
  nameEnglish: z.string().min(1, "Le nom en anglais est requis"),
  postalBox: z.string().min(1, "La boîte postale est requise"),
  email: z.string().email("Adresse e-mail invalide"),
  logo: z.string().optional(),
});

export type TranscriptSettingsPayload = z.infer<typeof TranscriptsettingsSchema>;
