import { API_BASE } from './config';
import { getToken } from '@clerk/clerk-react';

export async function arkFetch(path: string, init: RequestInit = {}) {
  const token = await getToken?.();
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json');
  if (token) headers.set('authorization', `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers, credentials: 'include' });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

/** Convenience wrappers */
export const getAccess = () => arkFetch('/api/users/check-access');
export const getCredits = () => arkFetch('/api/credits/check');
export const createSetupIntent = () => arkFetch('/api/billing/setup-intent', { method: 'POST' });
