import {Component, TemplateRef, ViewChild} from '@angular/core';

@Component({
  selector: 'tolle-dropdown-menu',
  standalone: true,
  imports: [],
  template: `
    <ng-template #menuTemplate>
      <div class="z-[1000] min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in zoom-in-95">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  styles: ``
})
export class DropdownMenuComponent {
  @ViewChild('menuTemplate') templateRef!: TemplateRef<any>;
}
