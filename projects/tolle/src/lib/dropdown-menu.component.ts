import { Component, TemplateRef, viewChild } from '@angular/core';

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
  `
})
export class DropdownMenuComponent {
  menuTemplate = viewChild<TemplateRef<any>>('menuTemplate');

  // For compatibility with the directive which expects it
  get templateRef(): TemplateRef<any> | undefined {
    return this.menuTemplate();
  }
}
