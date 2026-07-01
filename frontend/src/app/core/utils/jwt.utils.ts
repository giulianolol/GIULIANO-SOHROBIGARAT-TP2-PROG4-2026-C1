export function decodeToken(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(
      payload.replace(/-/g, '+').replace(/_/g, '/'),
    );
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getTokenExpiration(token: string): number | null {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return null;
  return decoded.exp * 1000; //SON MILISEGUNDOS
}