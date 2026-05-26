import { z } from 'zod';

export const collegeSearchSchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  minFee: z.preprocess((value) => {
    if (typeof value === 'string' && value.length) return Number(value);
  }, z.number().int().nonnegative().optional()),
  maxFee: z.preprocess((value) => {
    if (typeof value === 'string' && value.length) return Number(value);
  }, z.number().int().nonnegative().optional()),
  rating: z.preprocess((value) => {
    if (typeof value === 'string' && value.length) return Number(value);
  }, z.number().min(0).max(5).optional()),
  courseType: z.enum(['UG', 'PG', 'DIPLOMA', 'CERTIFICATION']).optional(),
  sort: z.enum(['ratingDesc', 'feesAsc', 'nameAsc']).optional(),
  page: z.preprocess((value) => {
    if (typeof value === 'string' && value.length) return Number(value);
  }, z.number().int().positive().default(1)),
  limit: z.preprocess((value) => {
    if (typeof value === 'string' && value.length) return Number(value);
  }, z.number().int().positive().max(50).default(12))
});

export const signupSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

export const saveCollegeSchema = z.object({
  collegeId: z.string().cuid()
});

export const compareCollegeSchema = z.object({
  ids: z.string().min(1)
});
