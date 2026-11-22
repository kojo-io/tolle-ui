import { Component, ElementRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownTriggerDirective } from './dropdown-trigger.directive';
import { DropdownMenuComponent } from './dropdown-menu.component';
import { DropdownItemComponent } from './dropdown-item.component';

describe('DropdownTriggerDirective', () => {
  it('should create an instance', () => {
    const el = new ElementRef(document.createElement('div'));
    const vcr = {} as ViewContainerRef;
    const directive = new DropdownTriggerDirective(el, vcr);
    expect(directive).toBeTruthy();
  });
});

@Component({
  imports: [DropdownTriggerDirective, DropdownMenuComponent, DropdownItemComponent],
  template: `
    <button id="trigger" [tolleDropdownTrigger]="menu">Open</button>
    <tolle-dropdown-menu #menu>
      <tolle-dropdown-item id="edit" (click)="picked = 'edit'">Edit</tolle-dropdown-item>
      <tolle-dropdown-item id="locked" [disabled]="true" (click)="picked = 'locked'">Locked</tolle-dropdown-item>
      <tolle-dropdown-item id="delete" (click)="picked = 'delete'">Delete</tolle-dropdown-item>
    </tolle-dropdown-menu>
  `,
})
class MenuHost {
  picked = '';
}

describe('DropdownTriggerDirective behaviour', () => {
  let fixture: ComponentFixture<MenuHost>;
  let trigger: HTMLButtonElement;

  const menu = () => document.body.querySelector<HTMLElement>('[role="menu"]');
  const item = (id: string) => document.body.querySelector<HTMLElement>(`#${id} [role="menuitem"]`)!;
  const key = (target: EventTarget, k: string) =>
    target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuHost);
    fixture.detectChanges();
    trigger = fixture.nativeElement.querySelector('#trigger');
  });

  afterEach(() => fixture.destroy());

  it('opens on click and closes after an item is chosen, running the item handler first', () => {
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    fixture.detectChanges();
    expect(menu()).not.toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    item('edit').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    fixture.detectChanges();
    expect(fixture.componentInstance.picked).toBe('edit');
    expect(menu()).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('does not close when a disabled item is clicked', () => {
    trigger.click();
    fixture.detectChanges();
    item('locked').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    fixture.detectChanges();
    expect(menu()).not.toBeNull();
  });

  it('keyboard: ArrowDown opens and focuses the first item, arrows skip disabled items, Enter activates', () => {
    key(trigger, 'ArrowDown');
    fixture.detectChanges();
    expect(document.activeElement).toBe(item('edit'));

    key(item('edit'), 'ArrowDown');
    expect(document.activeElement).withContext('skips the disabled item').toBe(item('delete'));

    key(item('delete'), 'ArrowDown');
    expect(document.activeElement).withContext('wraps').toBe(item('edit'));

    key(item('edit'), 'End');
    expect(document.activeElement).toBe(item('delete'));

    key(item('delete'), 'Enter');
    fixture.detectChanges();
    expect(fixture.componentInstance.picked).toBe('delete');
    expect(menu()).toBeNull();
    expect(document.activeElement).withContext('focus returns to the trigger').toBe(trigger);
  });

  it('Escape closes the menu and returns focus to the trigger', () => {
    key(trigger, 'ArrowDown');
    fixture.detectChanges();
    key(item('edit'), 'Escape');
    fixture.detectChanges();
    expect(menu()).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('a keyboard-initiated click (detail 0) moves focus into the menu', () => {
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(item('edit'));
  });
});
