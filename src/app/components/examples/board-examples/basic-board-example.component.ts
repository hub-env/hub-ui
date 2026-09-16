import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubBoardComponent } from '../../../../../projects/board/src/public-api';
import { HighlightModule } from 'ngx-highlightjs';
import { MOCK_BOARD } from '../../../data/board-mock.data';
import { ExampleContainerComponent } from '../../shared/example-container/example-container.component';
import { TranslatePipe } from 'ng-hub-ui-utils';

@Component({
	selector: 'app-basic-board-example',
	standalone: true,
	imports: [HubBoardComponent, HighlightModule, ExampleContainerComponent, TranslatePipe],
	template: `
		<app-example-container title="Board - Ejemplo Básico" description="Tablero básico con datos mock">
			<div slot="demo">
				<hub-board [board]="boardData"></hub-board>
			</div>

			<div slot="code">
				<h4>{{ 'UI.LIBRARY.PAGE.TEMPLATE' | translate }}</h4>
				<pre><code [highlight]="templateCode" language="xml"></code></pre>

				<h4 class="mt-4">{{ 'UI.LIBRARY.PAGE.COMPONENT' | translate }}</h4>
				<pre><code [highlight]="componentCode" language="typescript"></code></pre>

				<h4 class="mt-4">Data</h4>
				<pre><code [highlight]="dataCode" language="typescript"></code></pre>
			</div>
		</app-example-container>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: []
})
export class BasicBoardExampleComponent {
	/** Mock board data rendered in the demo. */
	boardData = MOCK_BOARD;

	/** Template source code shown in the example viewer. */
	templateCode = `<hub-board [board]="boardData"></hub-board>`;

	/** Component source code shown in the example viewer. */
	componentCode = `import { Component } from '@angular/core';
import { HubBoardComponent } from 'projects/board/src/public-api';

@Component({
  selector: 'app-basic-board-example',
  standalone: true,
  imports: [HubBoardComponent],
  template: \`
    <hub-board [board]="boardData"></hub-board>
  \`
})
export class BasicBoardExampleComponent {
  boardData = {
    id: 1,
    title: 'Desarrollo de Aplicación Web',
    columns: [
      {
        id: 1,
        title: 'Por Hacer',
        cards: [
          { id: 1, title: 'Diseñar wireframes' },
          { id: 2, title: 'Configurar proyecto' }
        ]
      },
      {
        id: 2,
        title: 'En Progreso', 
        cards: [
          { id: 3, title: 'Implementar componentes' }
        ]
      }
    ]
  };
}`;

	/** Data/interfaces source code shown in the example viewer. */
	dataCode = `interface Board {
  id: number;
  title: string;
  columns: BoardColumn[];
}

interface BoardColumn {
  id: number;
  title: string;
  cards: BoardCard[];
}

interface BoardCard {
  id: number;
  title: string;
  data?: any;
}`;
}
