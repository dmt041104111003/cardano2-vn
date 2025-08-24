import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireAuth, requireAdmin, AuthUser } from "./auth-utils";
import { checkRateLimit } from "./rate-limiter";
import { createErrorResponse } from "./api-response";

export type ApiHandler = (
  req: NextRequest,
  user?: AuthUser
) => Promise<NextResponse>;

const idempotencyStore = new Map<string, { response: any; timestamp: number }>();

export function withAuth(handler: ApiHandler, rateLimit = { limit: 100, windowMs: 15 * 60 * 1000 }) {
  return async (req: NextRequest) => {
    try {
      const rateLimitResult = checkRateLimit(req, rateLimit);
      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          createErrorResponse('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED'),
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': rateLimit.limit.toString(),
              'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
              'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            }
          }
        );
      }

      const user = await requireAuth();
      return await handler(req, user);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Unauthorized") {
          return NextResponse.json(createErrorResponse("Unauthorized", "UNAUTHORIZED"), { status: 401 });
        }
        if (error.message === "Forbidden") {
          return NextResponse.json(createErrorResponse("Forbidden", "FORBIDDEN"), { status: 403 });
        }
      }

      return NextResponse.json(createErrorResponse("Internal server error", "INTERNAL_ERROR"), { status: 500 });
    }
  };
}

export function withAdmin(handler: ApiHandler, rateLimit = { limit: 50, windowMs: 15 * 60 * 1000 }) {
  return async (req: NextRequest) => {
    try {
      const rateLimitResult = checkRateLimit(req, rateLimit);
      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          createErrorResponse('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED'),
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': rateLimit.limit.toString(),
              'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
              'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            }
          }
        );
      }

      const user = await requireAdmin();
      const result = await handler(req, user);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Unauthorized") {
          return NextResponse.json(createErrorResponse("Unauthorized", "UNAUTHORIZED"), { status: 401 });
        }
        if (error.message === "Forbidden") {
          return NextResponse.json(createErrorResponse("Forbidden", "FORBIDDEN"), { status: 403 });
        }
      }

      return NextResponse.json(createErrorResponse("Internal server error", "INTERNAL_ERROR"), { status: 500 });
    }
  };
}

export function withOptionalAuth(handler: ApiHandler) {
  return async (req: NextRequest) => {
    try {
      const user = await getCurrentUser();
      return await handler(req, user || undefined);
    } catch (error) {

      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}

export function withIdempotency(handler: ApiHandler, windowMs = 24 * 60 * 60 * 1000) {
  return async (req: NextRequest) => {
    if (req.method !== 'POST') {
      return await handler(req);
    }

    const idempotencyKey = req.headers.get('Idempotency-Key');
    if (!idempotencyKey) {
      return NextResponse.json(
        createErrorResponse('Idempotency-Key header required for POST requests', 'MISSING_IDEMPOTENCY_KEY'),
        { status: 400 }
      );
    }

    const now = Date.now();
    const existingResponse = idempotencyStore.get(idempotencyKey);

    if (existingResponse && (now - existingResponse.timestamp) < windowMs) {
      return NextResponse.json(existingResponse.response);
    }

    const response = await handler(req);
    const responseData = await response.json();
    
    idempotencyStore.set(idempotencyKey, {
      response: responseData,
      timestamp: now
    });

    return NextResponse.json(responseData, { status: response.status });
  };
}

setInterval(() => {
  const now = Date.now();
  const windowMs = 24 * 60 * 60 * 1000;
  
  for (const [key, value] of idempotencyStore.entries()) {
    if (now - value.timestamp > windowMs) {
      idempotencyStore.delete(key);
    }
  }
}, 60 * 60 * 1000);
