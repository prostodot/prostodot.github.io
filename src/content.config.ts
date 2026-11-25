import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const products = defineCollection({
  loader: glob({ base: './src/content/products', pattern: '*.md' }),
  schema: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    links: z.array(z.object({
      label: z.string().min(1),
      url: z.url({ protocol: /^https$/ }),
    })).min(1),
    icon: z.string().startsWith('/').optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '*.md' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    published: z.iso.date(),
    products: z.array(reference('products')).default([]),
  }),
});

export const collections = { products, blog };
