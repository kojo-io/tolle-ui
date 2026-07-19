import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  MenubarComponent,
  MenubarContentComponent,
  MenubarItemComponent,
  MenubarLabelComponent,
  MenubarMenuComponent,
  MenubarSeparatorComponent,
  MenubarService,
  MenubarTriggerComponent,
} from './menubar.component';

@Component({
  standalone: true,
  imports: [
    MenubarComponent,
    MenubarMenuComponent,
    MenubarTriggerComponent,
    MenubarContentComponent,
    MenubarItemComponent,
    MenubarSeparatorComponent,
    MenubarLabelComponent,
  ],
  template: `
    <tolle-menubar [size]="size" (openChange)="lastOpenId = $event">
      <tolle-menubar-menu id="file">
        <tolle-menubar-trigger>File</tolle-menubar-trigger>
        <tolle-menubar-content>
          <tolle-menubar-label>Document</tolle-menubar-label>
          <tolle-menubar-item (select)="picked = 'new'">New</tolle-menubar-item>
          <tolle-menubar-separator />
          <tolle-menubar-item [disabled]="true">Disabled</tolle-menubar-item>
          <tolle-menubar-item (select)="picked = 'save'">Save</tolle-menubar-item>
        </tolle-menubar-content>
      </tolle-menubar-menu>

      <tolle-menubar-menu id="edit">
        <tolle-menubar-trigger>Edit</tolle-menubar-trigger>
        <tolle-menubar-content>
          <tolle-menubar-item (select)="picked = 'undo'">Undo</tolle-menubar-item>
        </tolle-menubar-content>
      </tolle-menubar-menu>
    </tolle-menubar>
  `,
})
class HostComponent {
  @ViewChild(MenubarComponent) menubar!: MenubarComponent;
  size: 'sm' | 'default' | 'lg' = 'default';
  lastOpenId: string | null | undefined;
  picked = '';
}

describe('MenubarComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let service: MenubarService;

  const triggers = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('tolle-menubar-trigger button'));

  const panels = (): HTMLElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="menu"]'));

  const items = (): HTMLElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="menu"] [role="menuitem"]'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement
      .query((de) => de.componentInstance instanceof MenubarComponent)
      .injector.get(MenubarService);
  });

  it('should create with role="menubar" and no menu open', () => {
    expect(host.menubar).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[role="menubar"]')).toBeTruthy();
    expect(service.openId).toBeNull();
    expect(panels().length).toBe(0);
  });

  it('opens a menu when its trigger is clicked and closes it on a second click', () => {
    triggers()[0].click();
    fixture.detectChanges();

    expect(service.openId).toBe('file');
    expect(panels().length).toBe(1);
    expect(triggers()[0].getAttribute('aria-expanded')).toBe('true');
    expect(triggers()[0].getAttribute('data-state')).toBe('open');

    triggers()[0].click();
    fixture.detectChanges();

    expect(service.openId).toBeNull();
    expect(panels().length).toBe(0);
  });

  it('ignores hover while the bar is closed', () => {
    triggers()[1].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(service.openId).toBeNull();
    expect(panels().length).toBe(0);
  });

  it('switches to the hovered menu once any menu is open', () => {
    triggers()[0].click();
    fixture.detectChanges();
    expect(service.openId).toBe('file');

    // No click — hover alone must switch, that is the menu-bar behaviour.
    triggers()[1].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(service.openId).toBe('edit');
    expect(panels().length).toBe(1);
    expect(triggers()[0].getAttribute('aria-expanded')).toBe('false');
    expect(triggers()[1].getAttribute('aria-expanded')).toBe('true');
  });

  it('emits openChange with the open menu id and null on close', () => {
    triggers()[0].click();
    fixture.detectChanges();
    expect(host.lastOpenId).toBe('file');

    service.close();
    fixture.detectChanges();
    expect(host.lastOpenId).toBeNull();
  });

  it('moves between menus with ArrowRight/ArrowLeft, wrapping around', () => {
    triggers()[0].click();
    fixture.detectChanges();

    const bar: HTMLElement = fixture.nativeElement.querySelector('[role="menubar"]');
    bar.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(service.openId).toBe('edit');

    bar.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(service.openId).toBe('file');

    bar.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(service.openId).toBe('edit');
  });

  it('moves focus within the open menu with ArrowDown, skipping disabled items', () => {
    triggers()[0].click();
    fixture.detectChanges();

    const bar: HTMLElement = fixture.nativeElement.querySelector('[role="menubar"]');
    bar.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    const enabled = items().filter((i) => !i.hasAttribute('data-disabled'));
    expect(enabled.length).toBe(2);
    expect(document.activeElement).toBe(enabled[0]);

    bar.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(enabled[1]);
  });

  it('closes on Escape and returns focus to the trigger', () => {
    triggers()[0].click();
    fixture.detectChanges();

    const bar: HTMLElement = fixture.nativeElement.querySelector('[role="menubar"]');
    bar.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(service.openId).toBeNull();
    expect(document.activeElement).toBe(triggers()[0]);
  });

  it('closes when a pointerdown lands outside the bar', () => {
    triggers()[0].click();
    fixture.detectChanges();
    expect(service.openId).toBe('file');

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    fixture.detectChanges();

    expect(service.openId).toBeNull();
  });

  it('selecting an item emits select and closes the bar', () => {
    triggers()[0].click();
    fixture.detectChanges();

    const enabled = items().filter((i) => !i.hasAttribute('data-disabled'));
    enabled[1].click();
    fixture.detectChanges();

    expect(host.picked).toBe('save');
    expect(service.openId).toBeNull();
  });

  it('does not activate a disabled item', () => {
    triggers()[0].click();
    fixture.detectChanges();

    const disabled = items().find((i) => i.hasAttribute('data-disabled'))!;
    disabled.click();
    fixture.detectChanges();

    expect(host.picked).toBe('');
    expect(service.openId).toBe('file');
  });

  it('applies the cva size variant to the bar and its triggers', () => {
    host.size = 'lg';
    fixture.detectChanges();

    const bar: HTMLElement = fixture.nativeElement.querySelector('[role="menubar"]');
    expect(bar.className).toContain('h-12');
    expect(triggers()[0].className).toContain('h-9');
  });
});

describe('MenubarService', () => {
  let service: MenubarService;

  beforeEach(() => {
    service = new MenubarService();
  });

  it('hoverEnter is a no-op while nothing is open, and switches once open', () => {
    service.hoverEnter('b');
    expect(service.openId).toBeNull();

    service.open('a');
    service.hoverEnter('b');
    expect(service.openId).toBe('b');
  });

  it('toggle opens then closes the same id', () => {
    service.toggle('a');
    expect(service.isAnyOpen).toBeTrue();
    service.toggle('a');
    expect(service.isAnyOpen).toBeFalse();
  });

  it('closes when the open menu unregisters', () => {
    const menu = { id: 'a', triggerElement: null, contentElement: null };
    service.register(menu);
    service.open('a');
    service.unregister(menu);
    expect(service.openId).toBeNull();
  });
});
