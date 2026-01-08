import { Injectable, EventEmitter } from '@angular/core';
import { computePosition, offset, shift, flip, size } from '@floating-ui/dom';

export type ContextMenuItem = {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean;
  submenu?: ContextMenuItem[];
}

export type ContextMenuState = {
  x: number;
  y: number;
  items: ContextMenuItem[];
  isOpen: boolean;
  triggerElement?: HTMLElement;
  onAction?: (actionId: string) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {
  private _state: ContextMenuState = {
    x: 0,
    y: 0,
    items: [],
    isOpen: false
  };

  readonly stateChanged = new EventEmitter<ContextMenuState>();

  open(config: {
    event: MouseEvent;
    items?: ContextMenuItem[];
    triggerElement?: HTMLElement;
    onAction?: (actionId: string) => void;
  }) {
    const { event, items = [], triggerElement, onAction } = config;

    // Prevent browser context menu
    event.preventDefault();

    this._state = {
      x: event.clientX,
      y: event.clientY,
      items,
      isOpen: true,
      triggerElement,
      onAction
    };

    this.stateChanged.emit(this._state);
  }

  close() {
    this._state = { ...this._state, isOpen: false };
    this.stateChanged.emit(this._state);
  }

  async positionMenu(menuElement: HTMLElement) {
    const state = this._state;
    if (!state.isOpen || !menuElement) return;

    // We use a virtual element based on the mouse coordinates
    const virtualEl = {
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: state.x,
          y: state.y,
          top: state.y,
          left: state.x,
          right: state.x,
          bottom: state.y,
        };
      },
    };

    const { x, y } = await computePosition(virtualEl as any, menuElement, {
      placement: 'bottom-start',
      strategy: 'fixed',
      middleware: [
        offset(4),
        flip({ padding: 10 }),
        shift({ padding: 10 }),
        size({
          apply({ availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              maxHeight: `${availableHeight - 16}px`
            });
          }
        })
      ]
    });

    Object.assign(menuElement.style, {
      left: `${x}px`,
      top: `${y}px`,
      position: 'fixed'
    });
  }

  performAction(actionId: string) {
    this._state.onAction?.(actionId);
    this.close();
  }
}
