import { z } from 'zod';

export const CreateUserSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  name: z.string().optional(),
});

export const UpdateUserSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  name: z.string().optional(),
  promote: z.boolean().optional(),
});

export const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional().default('DRAFT'),
  tags: z.array(z.string()).optional(),
  media: z.array(z.object({
    url: z.string().url('Invalid URL'),
    type: z.enum(['IMAGE', 'VIDEO', 'YOUTUBE']).optional().default('IMAGE')
  })).optional(),
  githubRepo: z.string().url('Invalid GitHub URL').optional(),
});

export const UpdatePostSchema = CreatePostSchema.partial();

export const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url('Invalid image URL').optional(),
  link: z.string().url('Invalid link URL').optional(),
  year: z.number().int().min(2020, 'Year must be 2020 or later'),
  quarterly: z.number().int().min(1).max(4, 'Quarter must be 1-4'),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export const CreateTechnologySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url('Invalid image URL').optional(),
  link: z.string().url('Invalid link URL').optional(),
});

export const UpdateTechnologySchema = CreateTechnologySchema.partial();

export const CreateLandingContentSchema = z.object({
  section: z.string().min(1, 'Section is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  mainText: z.string().optional(),
  subText: z.string().optional(),
  media1Url: z.string().url('Invalid URL').optional(),
  media2Url: z.string().url('Invalid URL').optional(),
  media3Url: z.string().url('Invalid URL').optional(),
  media4Url: z.string().url('Invalid URL').optional(),
});

export const UpdateLandingContentSchema = CreateLandingContentSchema.partial();

export const CreateCourseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url('Invalid image URL').optional(),
  link: z.string().url('Invalid link URL').optional(),
});

export const UpdateCourseSchema = CreateCourseSchema.partial();

export const CreateEventLocationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
});

export const UpdateEventLocationSchema = CreateEventLocationSchema.partial();

export const PaginationSchema = z.object({
  page: z.string().transform(val => Math.max(1, parseInt(val) || 1)),
  limit: z.string().transform(val => Math.min(100, Math.max(1, parseInt(val) || 10))),
});

export const SearchSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
  type: z.enum(['posts', 'projects', 'technologies']).optional(),
});

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
      throw new Error(`Validation failed: ${messages.join(', ')}`);
    }
    throw error;
  }
}
