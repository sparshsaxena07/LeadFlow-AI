/**
 * Future Responsibility:
 * Centralize common TypeScript interfaces and types shared across controllers, services,
 * and database models.
 */

export interface UserContext {
  userId: string;
  role: string;
}

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
