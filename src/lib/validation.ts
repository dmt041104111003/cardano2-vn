import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  cursor: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export const userQuerySchema = z.object({
  address: z.string().optional(),
  email: z.string().email().optional()
}).refine(data => data.address || data.email, {
  message: "Either address or email is required"
});

export const courseSchema = z.object({
  name: z.string().min(1).max(100),
  image: z.string().url().optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional()
});

export const eventLocationSchema = z.object({
  name: z.string().min(1).max(100)
});

export const postSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  tags: z.array(z.string()).optional()
});

export const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  content: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  tags: z.array(z.string()).optional().default([]),
  media: z.array(z.object({
    url: z.string(),
    type: z.enum(['IMAGE', 'YOUTUBE', 'VIDEO', 'image', 'youtube', 'video']),
    id: z.string().optional()
  })).optional().default([]),
  githubRepo: z.union([z.string().url(), z.literal('')]).optional()
});

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.issues);
      const errorMessages = error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join(', ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    throw error;
  }
}

export function validateQueryParams<T>(schema: z.ZodSchema<T>, searchParams: URLSearchParams): T {
  const params = Object.fromEntries(searchParams.entries());
  return validateRequest(schema, params);
}

export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 1000);
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizeWalletAddress(address: string): string {
  return address.toLowerCase().trim();
}

export function validateRateLimitHeaders(headers: Headers): boolean {
  const userAgent = headers.get('user-agent');
  const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip');
  
  if (!userAgent || !ip) {
    return false;
  }
  
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /curl/i, /wget/i, /python/i, /java/i
  ];
  
  return !botPatterns.some(pattern => pattern.test(userAgent));
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Idempotency-Key',
  'Access-Control-Max-Age': '86400',
};

export function handleCORS(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }
  return null;
}
