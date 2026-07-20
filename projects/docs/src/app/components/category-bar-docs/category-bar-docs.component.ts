import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { BasicCategoryBarComponent } from '../../docs-examples/category-bar/basic-category-bar/basic-category-bar.component';
import { CategoryBarWithMarkerComponent } from '../../docs-examples/category-bar/category-bar-with-marker/category-bar-with-marker.component';

@Component({
  selector: 'app-category-bar-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    BasicCategoryBarComponent,
    CategoryBarWithMarkerComponent
  ],
  templateUrl: './category-bar-docs.component.html',
  styleUrl: './category-bar-docs.component.css'
})
export class CategoryBarDocsComponent {
  baseService = inject(BaseService);

  installation = `import { CategoryBarComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [CategoryBarComponent]
})`;

  anatomyCode = `<tolle-category-bar [values]="[15, 35, 35, 15]" [labels]="labels" ariaLabel="..." />`;

  basicCode = `<tolle-category-bar [values]="[15, 35, 35, 15]"
  [labels]="['Poor', 'Fair', 'Good', 'Excellent']"
  ariaLabel="Response time distribution" />`;

  markerCode = `<tolle-category-bar [values]="[20, 20, 20, 20, 20]"
  [labels]="['Poor', 'Fair', 'Good', 'Very good', 'Exceptional']"
  [markerValue]="markerValue"
  ariaLabel="Credit score band" />`;

  markerTsCode = `score = 720;
// The scale runs 300-850; markerValue is 0-100, so map the score into it.
markerValue = ((score - 300) / (850 - 300)) * 100;`;

  categoryBarProps: PropEntry[] = [
    { name: 'values', type: 'number[]', default: '[]', description: 'Width of each segment. Values that are not finite and greater than zero are dropped. Does not need to sum to 100 — segments are normalized to the bar’s full width.' },
    { name: 'labels', type: 'string[]', default: '[]', description: 'Name for each segment, by index. Used in the accessible summary and as a title tooltip.' },
    { name: 'colors', type: 'string[]', default: '[]', description: 'Paint for each segment, by index. Falls back to the chart palette --chart-1 through --chart-5, cycling past five.' },
    { name: 'markerValue', type: 'number | null', default: 'null', description: 'Position of the pointer, 0-100 on the same scale the segments sum to. Omit to draw no pointer; out-of-range values are clamped.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name, prefixed onto the sr-only summary of segments and marker position.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes, merged with cn() (last-wins).' }
  ];
}
