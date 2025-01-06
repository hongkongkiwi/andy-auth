import type { NextRequest } from 'next/server';

export interface DeviceInfo {
  browser: string;
  version: string;
  os: string;
  mobile: boolean;
}

export interface RequestInfo {
  requestId: string;
  ip: string;
  ipAddress?: string;
  userAgent: string;
  method: HTTPMethod;
  url: string;
  referrer?: string | null;
  traceId?: string | null;
  deviceInfo?: DeviceInfo;
}

export type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';

const getIpFromRequest = (request: Request | NextRequest): string => {
  const forwardedFor =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '';
  const realIp = request.headers.get('x-real-ip')?.trim() ?? '';
  const cfIp = request.headers.get('cf-connecting-ip')?.trim() ?? '';

  const ip = forwardedFor || realIp || cfIp;
  return isValidIp(ip) ? ip : 'unknown';
};

export const getRequestInfo = (
  request?: Request | NextRequest
): RequestInfo => {
  try {
    const userAgent = request?.headers.get('user-agent') || 'unknown';
    const deviceInfo = parseUserAgent(userAgent);

    const method = request?.method || 'unknown';
    const validMethod = isValidMethod(method) ? (method as HTTPMethod) : 'GET';

    return {
      requestId: request?.headers.get('x-request-id') || crypto.randomUUID(),
      ip: request ? getIpFromRequest(request) : 'unknown',
      ipAddress: request ? getIpFromRequest(request) : 'unknown',
      userAgent: request?.headers.get('user-agent') || 'unknown',
      method: validMethod,
      url: request?.url || 'unknown',
      referrer: request?.headers.get('referer') || null,
      traceId: request?.headers.get('x-trace-id') || null,
      deviceInfo
    };
  } catch (error) {
    console.error('Failed to get request info:', error);
    return {
      requestId: crypto.randomUUID(),
      ip: 'unknown',
      ipAddress: 'unknown',
      userAgent: 'unknown',
      method: 'GET',
      url: 'unknown',
      referrer: null,
      traceId: null
    };
  }
};

const isValidIp = (ip?: string): boolean => {
  if (!ip) return false;
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

const parseUserAgent = (ua: string): DeviceInfo => {
  try {
    // Basic user agent parsing
    const mobile = /mobile|android|iphone|ipad|ipod/i.test(ua.toLowerCase());
    const browser = getBrowser(ua);
    const os = getOS(ua);
    const version = getVersion(ua, browser);

    return { browser, version, os, mobile };
  } catch (error) {
    console.error('Failed to parse user agent:', error);
    return {
      browser: 'unknown',
      version: 'unknown',
      os: 'unknown',
      mobile: false
    };
  }
};

const getBrowser = (ua: string): string => {
  const browsers = {
    chrome: /chrome|chromium|crios/i,
    safari: /safari/i,
    firefox: /firefox|fxios/i,
    edge: /edge|edg/i,
    opera: /opera|opr/i,
    ie: /msie|trident/i
  };

  for (const [name, regex] of Object.entries(browsers)) {
    if (regex.test(ua)) return name;
  }
  return 'unknown';
};

const getOS = (ua: string): string => {
  const os = {
    windows: /windows nt/i,
    mac: /macintosh|mac os x/i,
    linux: /linux/i,
    android: /android/i,
    ios: /iphone|ipad|ipod/i
  };

  for (const [name, regex] of Object.entries(os)) {
    if (regex.test(ua)) return name;
  }
  return 'unknown';
};

const getVersion = (ua: string, browser: string): string => {
  try {
    const match = ua.match(new RegExp(`${browser}\/([\\d.]+)`, 'i'));
    return match?.[1] || 'unknown';
  } catch {
    return 'unknown';
  }
};

const isValidMethod = (method: string): method is HTTPMethod => {
  return ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].includes(
    method
  );
};
