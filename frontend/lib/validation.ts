import { z } from 'zod';

export const projectSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1).max(100),
    overviewText: z.string().max(2000).nullable(),
    description: z.string().max(5000).nullable(),
    overviewImage1: z.string().nullable(),
    overviewImage2: z.string().nullable(),
    overviewImage3: z.string().nullable(),
    link: z.string().nullable(),
    gitHubLink: z.string().nullable(),
});

export const projectIdSchema = z.string().regex(/^\d+$/).transform(Number);

export type Project = z.infer<typeof projectSchema>;