import { z } from 'zod';

export const personName = z.string().max(75);

export const email = z.string().email();
export const password = z.string().min(8);
export const nickname = z.string().min(3).max(50);
export const is_banned = z.boolean().default(false);

export const roles = z.array(z.string());
