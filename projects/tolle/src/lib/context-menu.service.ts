import { Injectable, EventEmitter } from '@angular/core';
import { computePosition, offset, shift, flip, size } from '@floating-ui/dom';

export type ContextMenuItem = {
  id?: string;
  label?: string;
  icon?: string;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean;
  submenu?: ContextMenuItem[];
  shortcut?: string;
  checked?: boolean;
  type?: 'default' | 'checkbox' | 'radio';
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

    // Create a precise virtual element for the mouse coordinates
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
      }
    };

    const { x, y } = await computePosition(virtualEl as any, menuElement, {
      placement: 'bottom-start', // Standard: Menu top-left aligns with mouse
      strategy: 'fixed',
      middleware: [
        offset(2), // Slight offset so mouse isn't covering the first pixel
        flip({
          padding: 10,
          fallbackPlacements: ['bottom-end', 'top-start', 'top-end']
        }),
        shift({ padding: 10 }),
        size({
          apply({ availableHeight, availableWidth, elements }) {
            Object.assign(elements.floating.style, {
              maxHeight: `${Math.max(100, availableHeight - 16)}px`,
              maxWidth: `${Math.max(200, availableWidth - 16)}px`,
              overflowY: 'auto'
            });
          }
        })
      ]
    });

    Object.assign(menuElement.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      transform: `translate(${Math.round(x)}px, ${Math.round(y)}px)`
    });
  }

  async positionSubmenu(triggerElement: HTMLElement, submenuElement: HTMLElement) {
    if (!triggerElement || !submenuElement) return;

    const { x, y } = await computePosition(triggerElement, submenuElement, {
      placement: 'right-start', // Standard: Submenu opens to the right
      strategy: 'fixed',
      middleware: [
        offset(-4), // Overlap slightly with parent menu
        flip({
          padding: 10,
          fallbackPlacements: ['left-start', 'bottom-start']
        }),
        shift({ padding: 10 }),
        size({
          apply({ availableHeight, availableWidth, elements }) {
            Object.assign(elements.floating.style, {
              maxHeight: `${Math.max(100, availableHeight - 16)}px`,
              maxWidth: `${Math.max(200, availableWidth - 16)}px`,
              overflowY: 'auto'
            });
          }
        })
      ]
    });

    Object.assign(submenuElement.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      transform: `translate(${Math.round(x)}px, ${Math.round(y)}px)`
    });
  }

  performAction(actionId: string) {
    this._state.onAction?.(actionId);
    this.close();
  }
}