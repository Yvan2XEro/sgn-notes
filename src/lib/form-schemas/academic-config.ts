"use client";

import * as z from "zod";

export const elementSchema = z.object({
  displayName: z.string().min(1, "Le nom de l'élément est requis"),
  excelColumn: z
    .number()
    .int()
    .positive("Le numéro de colonne doit être positif"),
});

export const teachingUnitSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
  name: z.string().min(1, "Le nom de l'unité d'enseignement est requis"),
  credits: z.number().int().positive("Le nombre de crédits doit être positif"),
  elements: z.array(elementSchema).min(1, "Au moins un élément est requis"),
});

export const academicConfigSchema = z.object({
  cycle: z.string().min(1, "Le cycle est requis"),
  academicYearStart: z
    .string()
    .regex(/^\d{4}$/, "Doit être une année à 4 chiffres"),
  academicYearEnd: z
    .string()
    .regex(/^\d{4}$/, "Doit être une année à 4 chiffres"),
  trainingCircle: z.string().min(1, "Le programme est requis"),
  level: z.enum(["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]),
  option: z.string().optional(),
  teachingUnits: z.array(teachingUnitSchema).min(1, "Au moins une unité d'enseignement"),
  excelFile: z.any().optional(),
});

export type AcademicConfigPayload = z.infer<typeof academicConfigSchema>