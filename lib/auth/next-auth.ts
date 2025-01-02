/**
 * NextAuth.js v5 Authentication Handler
 */
import NextAuth from 'next-auth';
import { authConfig } from './config/auth-config';

export const { auth, signIn, signOut } = NextAuth(authConfig);
