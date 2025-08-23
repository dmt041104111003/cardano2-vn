import { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
  message?: string;
}

export function checkRateLimit(
  req: NextRequest, 
  config: RateLimitConfig = { limit: 100, windowMs: 15 * 60 * 1000 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const identifier = getClientIdentifier(req);
  const now = Date.now();
  
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { 
      count: 1, 
      resetTime: now + config.windowMs 
    });
    return { 
      allowed: true, 
      remaining: config.limit - 1, 
      resetTime: now + config.windowMs 
    };
  }
  
  if (record.count >= config.limit) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: record.resetTime 
    };
  }
  
  record.count++;
  return { 
    allowed: true, 
    remaining: config.limit - record.count, 
    resetTime: record.resetTime 
  };
}

function getClientIdentifier(req: NextRequest): string {
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  return `${ip}-${userAgent}`;
}

export function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

if (typeof window === 'undefined') {
  setInterval(cleanupRateLimitMap, 5 * 60 * 1000);
}
