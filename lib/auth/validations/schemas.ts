import { z } from 'zod';
import { AuthMethod } from '../types/auth';
import { PlatformUserStatus, WorkspaceStatus } from '@prisma/client';

// Base enums from Prisma/DB
export const AuthMethodSchema = z.nativeEnum(AuthMethod);
export const UserStatusSchema = z.nativeEnum(PlatformUserStatus);
export const WorkspaceStatusSchema = z.nativeEnum(WorkspaceStatus);

// Basic emergency contact schema
export const EmergencyContactSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  emailAddress: z.string().email().optional(),
  address: z.string().optional(),
  relationship: z.string()
});
