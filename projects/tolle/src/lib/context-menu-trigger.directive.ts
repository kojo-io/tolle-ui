import { Directive, ElementRef, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { ContextMenuService, ContextMenuItem } from './context-menu.service';

@Directive({
  selector: '[tolleContextMenuTrigger]',
  standalone: true
})
export class ContextMenuTriggerDirective {
  private elementRef = inject(ElementRef);
  private contextMenuService = inject(ContextMenuService);

  @Input('tolleContextMenuTrigger') items: ContextMenuItem[] = [];
  @Output() action = new EventEmitter<string>();

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.stopPropagation();
    this.contextMenuService.open({
      event,
      items: this.items,
      triggerElement: this.elementRef.nativeElement,
      onAction: (actionId) => this.action.emit(actionId)
    });
  }
}
