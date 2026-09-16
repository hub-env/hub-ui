/**
 * Type definitions for the board demo mock data.
 *
 * Describes the custom payload attached to each board card in the kanban
 * examples. The actual mock boards live in `board-mock.data.ts`.
 */

/**
 * Custom data payload carried by each board card in the demo boards.
 *
 * Used as the generic type argument for `BoardCard`, `BoardColumn` and
 * `Board` so the kanban examples expose strongly-typed card metadata.
 */
export interface TaskData {
	/** Optional name of the person the task is assigned to. */
	assignee?: string;
	/** Relative importance of the task. */
	priority: 'low' | 'medium' | 'high';
	/** Free-form labels used to categorise the task. */
	tags: string[];
	/** Optional deadline by which the task should be completed. */
	dueDate?: Date;
}
