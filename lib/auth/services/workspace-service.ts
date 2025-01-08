import { transaction, getProtectedDb } from '@/lib/db/index';
import { createServiceAuditLog } from './audit-service';
import {
  AuditLogEventType,
  AuditLogResourceType,
  AuditSeverityLevel,
  EntityStatus
} from '@prisma/client';
import { checkTransactionPermission, Operation } from '../utils/permissions';
import {
  WorkspaceCreateSchema,
  WorkspaceUpdateSchema
} from '@/lib/schemas/models';
import type { z } from 'zod';
import { WORKSPACE_ERRORS } from '../errors';

export const createWorkspace = async (
  userId: string,
  data: z.infer<typeof WorkspaceCreateSchema>,
  request?: Request
) => {
  const db = await getProtectedDb();
  return transaction(db, async (tx) => {
    const canCreate = await checkTransactionPermission(
      userId,
      Operation.Create,
      data,
      tx
    );

    if (!canCreate) {
      throw WORKSPACE_ERRORS.UNAUTHORIZED({
        message: 'Cannot create workspace',
        context: 'createWorkspace',
        metadata: { userId }
      });
    }

    const workspace = await tx.workspace.create({
      data: {
        ...data,
        status: EntityStatus.ACTIVE,
        createdBy: userId,
        settings: data.settings ? { set: data.settings } : undefined,
        address: data.address ? { set: data.address } : undefined
      }
    });

    await createServiceAuditLog(
      {
        userId,
        eventType: AuditLogEventType.CREATE,
        description: 'Workspace created',
        resourceType: AuditLogResourceType.WORKSPACE,
        resourceId: workspace.id,
        severity: AuditSeverityLevel.INFO,
        request
      },
      tx
    );

    return workspace;
  });
};

export const updateWorkspace = async (
  userId: string,
  workspaceId: string,
  data: z.infer<typeof WorkspaceUpdateSchema>,
  request?: Request
) => {
  const db = await getProtectedDb();
  return transaction(db, async (tx) => {
    const canUpdate = await checkTransactionPermission(
      userId,
      Operation.Update,
      data,
      tx
    );

    if (!canUpdate) {
      throw WORKSPACE_ERRORS.UNAUTHORIZED({
        message: 'Cannot update workspace',
        context: 'updateWorkspace',
        metadata: { userId, workspaceId }
      });
    }

    const workspace = await tx.workspace.findUnique({
      where: { id: workspaceId }
    });

    if (!workspace) {
      throw WORKSPACE_ERRORS.NOT_FOUND({
        context: 'updateWorkspace',
        metadata: { workspaceId }
      });
    }

    const updatedWorkspace = await tx.workspace.update({
      where: { id: workspaceId },
      data: {
        ...data,
        settings: data.settings ? { set: data.settings } : undefined,
        address: data.address ? { set: data.address } : undefined
      }
    });

    await createServiceAuditLog(
      {
        userId,
        eventType: AuditLogEventType.UPDATE,
        description: 'Workspace updated',
        resourceType: AuditLogResourceType.WORKSPACE,
        resourceId: updatedWorkspace.id,
        severity: AuditSeverityLevel.INFO,
        request
      },
      tx
    );

    return updatedWorkspace;
  });
};

export const deleteWorkspace = async (
  userId: string,
  workspaceId: string,
  request?: Request
) => {
  const db = await getProtectedDb();
  return transaction(db, async (tx) => {
    const canDelete = await checkTransactionPermission(
      userId,
      Operation.Delete,
      undefined,
      tx
    );

    if (!canDelete) {
      throw WORKSPACE_ERRORS.UNAUTHORIZED({
        message: 'Cannot delete workspace',
        context: 'deleteWorkspace',
        metadata: { userId, workspaceId }
      });
    }

    const workspace = await tx.workspace.findUnique({
      where: { id: workspaceId }
    });

    if (!workspace) {
      throw WORKSPACE_ERRORS.NOT_FOUND({
        context: 'deleteWorkspace',
        metadata: { workspaceId }
      });
    }

    const deletedWorkspace = await tx.workspace.update({
      where: { id: workspaceId },
      data: { status: EntityStatus.DELETED }
    });

    await createServiceAuditLog(
      {
        userId,
        eventType: AuditLogEventType.DELETE,
        description: 'Workspace deleted',
        resourceType: AuditLogResourceType.WORKSPACE,
        resourceId: deletedWorkspace.id,
        severity: AuditSeverityLevel.WARNING,
        request
      },
      tx
    );

    return deletedWorkspace;
  });
};
