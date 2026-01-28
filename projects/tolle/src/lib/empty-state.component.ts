import { Component, input } from '@angular/core';

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
  imports: [],
  template: `
    <div [class]="cn(emptyStateVariants({ variant: variant() }), class())">
    
      <div [class]="cn(
        'flex items-center justify-center rounded-full bg-muted',
        variant() === 'minimal' ? 'h-12 w-12' : 'h-20 w-20'
      )">
        <ng-content select="[icon]">
          <i [class]="cn(
            'ri-inbox-line text-muted-foreground/60',
            variant() === 'minimal' ? 'text-xl' : 'text-3xl'
          )"></i>
        </ng-content>
      </div>
    
      <h3 [class]="cn(
        'font-semibold text-foreground',
        variant() === 'minimal' ? 'mt-2 text-sm' : 'mt-4 text-lg'
      )">
        {{ title() }}
      </h3>
    
      @if (description()) {
        <p [class]="cn(
          'text-muted-foreground',
          variant() === 'minimal' ? 'mt-1 text-xs' : 'mb-6 mt-2 max-w-sm text-sm'
        )">
          {{ description() }}
        </p>
      }
    
      @if (variant() !== 'minimal') {
        <div class="flex items-center justify-center gap-3">
          <ng-content select="[actions]"></ng-content>
        </div>
      }
    </div>
    `
})
export class EmptyStateComponent {
  variant = input<EmptyStateVariants['variant']>('default');
  title = input<string>('No items found');
  description = input<string | undefined>();
  class = input<string>('');

  protected emptyStateVariants = emptyStateVariants;
  protected cn = cn;
}
