import { Board, BoardCard, BoardColumn } from 'ng-hub-ui-board';

export class BoardExampleUtils {
	/**
	 * Creates a board card with the provided identifiers and content.
	 * @param id The unique identifier of the card.
	 * @param columnId The identifier of the column that owns the card.
	 * @param title The card title.
	 * @param description The optional card description.
	 * @returns The constructed board card.
	 */
	static createCard(id: number, columnId: number, title: string, description: string = ''): BoardCard {
		return {
			id,
			columnId,
			title,
			description,
			data: { originalTitle: title }
		};
	}

	/**
	 * Creates a board column populated with the supplied cards.
	 * @param id The unique identifier of the column.
	 * @param title The column title.
	 * @param cards The cards contained in the column.
	 * @returns The constructed board column.
	 */
	static createColumn(id: number, title: string, cards: BoardCard[] = []): BoardColumn {
		return {
			id,
			title,
			cards,
			classlist: 'example-column'
		};
	}

	/**
	 * Creates a board with the given title and columns.
	 * @param title The board title.
	 * @param columns The columns contained in the board.
	 * @returns The constructed board.
	 */
	static createBoard(title: string, columns: BoardColumn[] = []): Board {
		return {
			title,
			columns
		};
	}

	/**
	 * Builds a simple sample Kanban board with predefined columns and cards.
	 * @returns A ready-to-use board for demonstration purposes.
	 */
	static getSimpleBoard(): Board {
		const todoCards = [
			this.createCard(1, 1, 'Research', 'Analyze requirements'),
			this.createCard(2, 1, 'Design', 'Create UI mockups')
		];
		const doingCards = [this.createCard(3, 2, 'Development', 'Implement core features')];
		const doneCards = [this.createCard(4, 3, 'Planning', 'Initial meeting')];

		return this.createBoard('Simple Kanban', [
			this.createColumn(1, 'To Do', todoCards),
			this.createColumn(2, 'In Progress', doingCards),
			this.createColumn(3, 'Done', doneCards)
		]);
	}
}
