import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireAuth, requireAdmin, AuthUser } from "./auth-utils";
import { checkRateLimit } from "./rate-limiter";
import { createErrorResponse } from "./api-response";

export type ApiHandler = (
  req: NextRequest,
  user?: AuthUser
) => Promise<NextResponse>;

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
