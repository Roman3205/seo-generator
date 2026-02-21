import * as z from 'zod'

export default z.object({
  title: z.string().min(2, 'Must be at least 2 characters'),
  url: z.url().optional(),
  audience: z.string().min(5, 'Must be at least 5 characters').optional(),
  keywords: z.string().min(10, 'Must be at least 10 characters').optional(),
  description: z.string().min(20, 'Must be at least 20 characters').optional(),
  industry: z.string().min(2, 'Must be at least 2 characters')
})

export interface SeoMetadata {
  metaTitle: string;
  metaDescription: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  ogTitle: string;
  ogDescription: string;
  twitterDescription: string;
  h1Suggestion: string;
  h2Suggestions: string[];
  schemaType: string;
  seoTips: string[];
}

export const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters')
})