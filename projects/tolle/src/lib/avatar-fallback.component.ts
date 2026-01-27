import { Component } from '@angular/core';

@Component({
    selector: 'tolle-avatar-fallback',
    imports: [],
    template: `
    <div class="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium uppercase">
      <ng-content></ng-content>
    </div>
  `,
    styles: ``
})
export class AvatarFallbackComponent {

}
