import { Component, input } from '@angular/core';
import { cn } from "./utils/cn";

@Component({
  selector: 'tolle-breadcrumb',
  standalone: true,
  imports: [],
  template: `
    <nav aria-label="breadcrumb" [class]="cn('flex flex-wrap items-center break-words text-sm text-muted-foreground', className())">
      <ol class="flex flex-wrap items-center gap-1.5 break-words">
        <ng-content></ng-content>
      </ol>
    </nav>
  `
})
export class BreadcrumbComponent {
  className = input('', { alias: 'class' });
  protected cn = cn;
}
