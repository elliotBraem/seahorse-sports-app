interface CookieOptions {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

const defaultOptions: CookieOptions = {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax",
};

export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): void {
  const mergedOptions = { ...defaultOptions, ...options };
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (mergedOptions.path) {
    cookie += `; Path=${mergedOptions.path}`;
  }

  if (mergedOptions.domain) {
    cookie += `; Domain=${mergedOptions.domain}`;
  }

  if (mergedOptions.maxAge) {
    cookie += `; Max-Age=${mergedOptions.maxAge}`;
  }

  if (mergedOptions.expires) {
    cookie += `; Expires=${mergedOptions.expires.toUTCString()}`;
  }

  if (mergedOptions.httpOnly) {
    cookie += "; HttpOnly";
  }

  if (mergedOptions.secure) {
    cookie += "; Secure";
  }

  if (mergedOptions.sameSite) {
    cookie += `; SameSite=${mergedOptions.sameSite}`;
  }

  document.cookie = cookie;
}

export function removeCookie(name: string, options: CookieOptions = {}): void {
  const mergedOptions = { ...defaultOptions, ...options };
  mergedOptions.expires = new Date(0); // Set to epoch time
  setCookie(name, "", mergedOptions);
}

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=").map((c) => c.trim());
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}
