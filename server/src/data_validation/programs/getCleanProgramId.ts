import { randomUUID } from 'crypto';

export const getCleanProgramId = (programId: unknown): string => {
    if (typeof programId === 'string' && programId.trim().length > 0) {
        return programId;
    }
    return randomUUID();
};