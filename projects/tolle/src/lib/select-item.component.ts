import {Component, Input, HostListener, ElementRef, Optional} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from './utils/cn';
import {SelectService} from './select.service';

@Component({
  selector: 'tolle-select-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="!hidden"
      [class]="cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground  transition-colors',
        selected ? 'bg-accent text-accent-foreground' : '',
        class
      )"
    >
      <span *ngIf="selected" class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <i class="ri-check-line text-primary"></i>
      </span>
      <ng-content></ng-content>
    </div>
  `,
})
export class SelectItemComponent {
  @Input() value: any;
  @Input() class = '';
  @Input() selected = false;
  hidden = false;
  constructor(
    @Optional() private selectService: SelectService,
    private el: ElementRef
  ) {}

  // Helper method for the parent to get the searchable text
  getLabel(): string {
    return this.el.nativeElement.innerText || '';
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.hidden) return;
    event.stopPropagation();
    if (this.selectService) {
      // Get the text content to show in the trigger button
      const label = this.el.nativeElement.innerText.trim();
      this.selectService.registerClick(this.value, label);
    }
  }

  protected cn = cn;
}
