import { Component, input } from '@angular/core';

import { cn } from './utils/cn';

@Component({
  selector: 'tolle-card',
  standalone: true,
  imports: [],
  template: `
    <div [class]="cn('rounded-md border border-border text-card-foreground shadow', class())">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  class = input<string>('');
  protected cn = cn;
}

@Component({
  selector: 'tolle-card-header',
  standalone: true,
  template: `<div [class]="cn('flex flex-col space-y-1.5 p-6', class())"><ng-content></ng-content></div>`,
})
export class CardHeaderComponent {
  class = input<string>('');
  protected cn = cn;
}

@Component({
  selector: 'tolle-card-title',
  standalone: true,
  template: `<h3 [class]="cn('font-semibold leading-none tracking-tight', class())"><ng-content></ng-content></h3>`,
})
export class CardTitleComponent {
  class = input<string>('');
  protected cn = cn;
}

@Component({
  selector: 'tolle-card-content',
  standalone: true,
  template: `<div [class]="cn('p-6 pt-0', class())"><ng-content></ng-content></div>`,
})
export class CardContentComponent {
  class = input<string>('');
  protected cn = cn;
}

@Component({
  selector: 'tolle-card-footer',
  standalone: true,
  template: `<div [class]="cn('flex items-center p-6 pt-0', class())"><ng-content></ng-content></div>`,
})
export class CardFooterComponent {
  class = input<string>('');
  protected cn = cn;
}
