import { Directive, ElementRef, HostListener, inject, input, output } from '@angular/core';
import { ContextMenuService, ContextMenuItem } from './context-menu.service';

@Directive({
  selector: '[tolleContextMenuTrigger]',
  standalone: true
})
export class ContextMenuTriggerDirective {
  private elementRef = inject(ElementRef);
  private contextMenuService = inject(ContextMenuService);

  items = input<ContextMenuItem[]>([], { alias: 'tolleContextMenuTrigger' });
  action = output<string>();

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.stopPropagation();
    this.contextMenuService.open({
      event,
      items: this.items(),
      triggerElement: this.elementRef.nativeElement,
      onAction: (actionId: string) => this.action.emit(actionId)
    });
  }
}
