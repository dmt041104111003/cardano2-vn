import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireAuth, requireAdmin, AuthUser } from "./auth-utils";

export type ApiHandler = (
  req: NextRequest,
  user?: AuthUser
) => Promise<NextResponse>;

export function withAuth(handler: ApiHandler) {
  return async (req: NextRequest) => {
    try {
      const user = await requireAuth();
      return await handler(req, user);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Unauthorized") {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error.message === "Forbidden") {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }

      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}

export function withAdmin(handler: ApiHandler) {
  return async (req: NextRequest) => {
    try {
      const user = await requireAdmin();
      return await handler(req, user);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Unauthorized") {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (error.message === "Forbidden") {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }

      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
