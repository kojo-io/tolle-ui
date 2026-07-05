import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';

@Component({
  selector: 'tolle-card',
  standalone: true,
  imports: [CommonModule],
  // Card owns the vertical rhythm: `flex-col` + `gap-6` spaces the sections and
  // `py-6` gives top/bottom padding. Sub-sections only add horizontal padding
  // (`px-6`). This means a card renders correctly with ANY combination of
  // header / content / footer — including content-only — with no `pt-0` hacks.
  template: `
    <div [class]="cn('flex flex-col gap-6 rounded-lg border border-border bg-card text-card-foreground py-6 shadow-sm', class)">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent { @Input() class = ''; protected cn = cn; }

@Component({
  selector: 'tolle-card-header',
  standalone: true,
  template: `<div [class]="cn('flex flex-col gap-1.5 px-6', class)"><ng-content></ng-content></div>`,
})
export class CardHeaderComponent { @Input() class = ''; protected cn = cn; }

@Component({
  selector: 'tolle-card-title',
  standalone: true,
  template: `<h3 [class]="cn('font-semibold leading-none tracking-tight', class)"><ng-content></ng-content></h3>`,
})
export class CardTitleComponent { @Input() class = ''; protected cn = cn; }

@Component({
  selector: 'tolle-card-description',
  standalone: true,
  template: `<p [class]="cn('text-sm text-muted-foreground', class)"><ng-content></ng-content></p>`,
})
export class CardDescriptionComponent { @Input() class = ''; protected cn = cn; }

@Component({
  selector: 'tolle-card-content',
  standalone: true,
  template: `<div [class]="cn('px-6', class)"><ng-content></ng-content></div>`,
})
export class CardContentComponent { @Input() class = ''; protected cn = cn; }

@Component({
  selector: 'tolle-card-footer',
  standalone: true,
  template: `<div [class]="cn('flex items-center px-6', class)"><ng-content></ng-content></div>`,
})
export class CardFooterComponent { @Input() class = ''; protected cn = cn; }
