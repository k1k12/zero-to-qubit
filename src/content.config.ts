import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lectures = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/lectures' }),
  schema: z.object({
    number: z.number(),
    title: z.string(),
    lecturer: z.string(),
    blurb: z.string(),
    minutes: z.number(),
    objectives: z.array(z.string()),
    prereqs: z.array(z.number()).default([]),
    // One-page printable summary: a handful of boxes, each with a few lines ($maths$ allowed)
    sheet: z.array(z.object({ title: z.string(), points: z.array(z.string()) })),
  }),
});

export const collections = { lectures };
