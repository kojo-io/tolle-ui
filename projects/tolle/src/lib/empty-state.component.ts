import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center animate-in fade-in duration-500",
  {
    variants: {
      variant: {
        default: "min-h-[400px] rounded-md border border-dashed border-border p-8 bg-background/50",
        minimal: "p-4 min-h-[200px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type EmptyStateVariants = VariantProps<typeof emptyStateVariants>;

@Component({
  selector: 'tolle-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cn(emptyStateVariants({ variant }), class)">

      <div [class]="cn(
        'flex items-center justify-center rounded-full bg-muted',
        variant === 'minimal' ? 'h-12 w-12' : 'h-20 w-20'
      )">
        <ng-content select="[icon]">
          <i [class]="cn(
            'ri-inbox-line text-muted-foreground/60',
            variant === 'minimal' ? 'text-xl' : 'text-3xl'
          )"></i>
        </ng-content>
      </div>

      <h3 [class]="cn(
        'font-semibold text-foreground',
        variant === 'minimal' ? 'mt-2 text-sm' : 'mt-4 text-lg'
      )">
        {{ title }}
      </h3>

      <p *ngIf="description" [class]="cn(
        'text-muted-foreground',
        variant === 'minimal' ? 'mt-1 text-xs' : 'mb-6 mt-2 max-w-sm text-sm'
      )">
        {{ description }}
      </p>

      <div *ngIf="variant !== 'minimal'" class="flex items-center justify-center gap-3">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() variant: EmptyStateVariants['variant'] = 'default';
  @Input() title: string = 'No items found';
  @Input() description?: string;
  @Input() class: string = '';

  protected emptyStateVariants = emptyStateVariants;
  protected cn = cn;
}
