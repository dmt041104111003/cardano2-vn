export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    cursor?: string;
    nextCursor?: string;
    prevCursor?: string;
  };
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
  cursor?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function createSuccessResponse<T>(data: T, pagination?: any): ApiResponse<T> {
  return {
    success: true,
    data,
    pagination,
    timestamp: new Date().toISOString()
  };
}

export function createErrorResponse(message: string, code?: string): ApiResponse {
  return {
    success: false,
    error: message,
    code,
    timestamp: new Date().toISOString()
  };
}

export function getPaginationParams(req: Request): PaginationParams {
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '10')));
  const offset = (page - 1) * limit;
  const cursor = url.searchParams.get('cursor') || undefined;
  const sortBy = url.searchParams.get('sortBy') || 'createdAt';
  const sortOrder = (url.searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
  
  return { page, limit, offset, cursor, sortBy, sortOrder };
}

export function createPaginationResponse(
  data: any[],
  total: number,
  page: number,
  limit: number,
  cursor?: string,
  nextCursor?: string,
  prevCursor?: string
) {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    cursor,
    nextCursor,
    prevCursor
  };
}

export function createCursorPaginationResponse(
  data: any[],
  limit: number,
  cursor?: string,
  nextCursor?: string,
  prevCursor?: string
) {
  return {
    page: 1,
    limit,
    total: data.length,
    totalPages: 1,
    hasNext: !!nextCursor,
    hasPrev: !!prevCursor,
    cursor,
    nextCursor,
    prevCursor
  };
}
