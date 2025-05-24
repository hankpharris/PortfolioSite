import { z } from 'zod';

export const projectSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1).max(100),
    overviewText: z.string().max(500).nullable(),
    description: z.string().max(2000).nullable(),
    overviewImage1: z.string().url().nullable(),
    overviewImage2: z.string().url().nullable(),
    overviewImage3: z.string().url().nullable(),
    link: z.string().url().nullable(),
    gitHubLink: z.string().url().nullable(),
});

export const projectIdSchema = z.string().regex(/^\d+$/).transform(Number);

export type Project = z.infer<typeof projectSchema>;