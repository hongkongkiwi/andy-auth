import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import type { NextAuthConfig } from 'next-auth';

export const { auth, signIn, signOut } = NextAuth(authConfig as NextAuthConfig);
