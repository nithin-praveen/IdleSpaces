'use client';

const STORAGE_KEY = 'idlespaces_requested_spaces';

export interface RequestedRecord {
  spaceId: string;
  spaceName: string;
  bookingRef?: string;
  requestedAt: string;
}

/**
 * Retrieves all stored requested space records from localStorage.
 */
export function getRequestedSpaceRecords(): RequestedRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => {
        if (typeof item === 'string') {
          return {
            spaceId: item,
            spaceName: '',
            requestedAt: new Date().toISOString(),
          };
        }
        return item as RequestedRecord;
      });
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Checks whether a specific space (by ID or name) has already had an access request submitted.
 */
export function isSpaceRequested(space: { id: string; name: string } | string): boolean {
  if (typeof window === 'undefined') return false;
  const records = getRequestedSpaceRecords();
  if (typeof space === 'string') {
    return records.some((r) => r.spaceId === space || r.spaceName.toLowerCase() === space.toLowerCase());
  }
  return records.some(
    (r) =>
      r.spaceId === space.id ||
      (r.spaceName && r.spaceName.toLowerCase() === space.name.toLowerCase())
  );
}

/**
 * Marks a space as requested in localStorage and broadcasts an event to sync UI components.
 */
export function markSpaceAsRequested(
  spaceId: string,
  spaceName: string = '',
  bookingRef?: string
): void {
  if (typeof window === 'undefined' || !spaceId) return;
  try {
    const records = getRequestedSpaceRecords();
    const alreadyExists = records.some(
      (r) => r.spaceId === spaceId || (spaceName && r.spaceName.toLowerCase() === spaceName.toLowerCase())
    );

    if (!alreadyExists) {
      const newRecord: RequestedRecord = {
        spaceId,
        spaceName,
        bookingRef,
        requestedAt: new Date().toISOString(),
      };
      const updated = [...records, newRecord];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    // Broadcast across windows/tabs and local components
    window.dispatchEvent(
      new CustomEvent('idlespaces_requested_changed', {
        detail: { spaceId, spaceName, bookingRef },
      })
    );
  } catch (err) {
    console.error('[markSpaceAsRequested] Error storing requested space:', err);
  }
}
