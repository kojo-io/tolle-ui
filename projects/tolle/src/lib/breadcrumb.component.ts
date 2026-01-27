import {Component, Input} from '@angular/core';
import { cn } from "./utils/cn";

@Component({
    selector: 'tolle-breadcrumb',
    imports: [],
    template: `
    <nav aria-label="breadcrumb" [class]="cn('flex flex-wrap items-center break-words text-sm text-muted-foreground', class)">
      <ol class="flex flex-wrap items-center gap-1.5 break-words">
        <ng-content></ng-content>
      </ol>
    </nav>
  `,
    styles: ``
})
export class BreadcrumbComponent {
  @Input() class: string = '';
  protected cn = cn;
}
