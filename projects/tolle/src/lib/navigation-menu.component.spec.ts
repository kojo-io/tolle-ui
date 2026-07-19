import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import {
  NavigationMenuComponent,
  NavigationMenuContentComponent,
  NavigationMenuItemComponent,
  NavigationMenuLinkComponent,
  NavigationMenuListComponent,
  NavigationMenuService,
  NavigationMenuTriggerComponent,
} from './navigation-menu.component';

@Component({
  standalone: true,
  imports: [
    NavigationMenuComponent,
    NavigationMenuListComponent,
    NavigationMenuItemComponent,
    NavigationMenuTriggerComponent,
    NavigationMenuContentComponent,
    NavigationMenuLinkComponent,
  ],
  template: `
    <tolle-navigation-menu [closeDelay]="closeDelay" (openChange)="lastOpenId = $event">
      <tolle-navigation-menu-list>
        <tolle-navigation-menu-item id="products">
          <tolle-navigation-menu-trigger>Products</tolle-navigation-menu-trigger>
          <tolle-navigation-menu-content>
            <tolle-navigation-menu-link href="/analytics">Analytics</tolle-navigation-menu-link>
          </tolle-navigation-menu-content>
        </tolle-navigation-menu-item>

        <tolle-navigation-menu-item id="company">
          <tolle-navigation-menu-trigger>Company</tolle-navigation-menu-trigger>
          <tolle-navigation-menu-content>
            <tolle-navigation-menu-link href="/about" [active]="true">About</tolle-navigation-menu-link>
          </tolle-navigation-menu-content>
        </tolle-navigation-menu-item>
      </tolle-navigation-menu-list>
    </tolle-navigation-menu>
  `,
})
class HostComponent {
  @ViewChild(NavigationMenuComponent) nav!: NavigationMenuComponent;
  closeDelay = 150;
  lastOpenId: string | null | undefined;
}

describe('NavigationMenuComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let service: NavigationMenuService;

  const triggers = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('tolle-navigation-menu-trigger button'));

  const panels = (): HTMLElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('tolle-navigation-menu-content > div'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement
      .query((de) => de.componentInstance instanceof NavigationMenuComponent)
      .injector.get(NavigationMenuService);
  });

  afterEach(() => service.cancelClose());

  it('should create a labelled nav landmark with nothing open', () => {
    expect(host.nav).toBeTruthy();
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Main');
    expect(service.openId).toBeNull();
    expect(panels().length).toBe(0);
  });

  it('opens the panel on hover and reflects ARIA state on the trigger', () => {
    triggers()[0].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(service.openId).toBe('products');
    expect(panels().length).toBe(1);
    expect(triggers()[0].getAttribute('aria-expanded')).toBe('true');
    expect(triggers()[0].getAttribute('aria-controls')).toBe('products-content');
    expect(host.lastOpenId).toBe('products');
  });

  it('opens on focus and on click for keyboard/pointer users', () => {
    triggers()[0].dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(service.openId).toBe('products');

    triggers()[0].click(); // toggles closed
    fixture.detectChanges();
    expect(service.openId).toBeNull();

    triggers()[1].click();
    fixture.detectChanges();
    expect(service.openId).toBe('company');
  });

  it('opens on ArrowDown from the trigger', () => {
    triggers()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    expect(service.openId).toBe('products');
  });

  it('defers closing on mouseleave until closeDelay elapses', fakeAsync(() => {
    triggers()[0].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    triggers()[0].dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();

    // Still open during the grace period.
    expect(service.isCloseScheduled).toBeTrue();
    tick(100);
    expect(service.openId).toBe('products');

    tick(50);
    fixture.detectChanges();
    expect(service.openId).toBeNull();
    expect(service.isCloseScheduled).toBeFalse();
  }));

  it('cancels the pending close when the pointer enters the panel', fakeAsync(() => {
    triggers()[0].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    triggers()[0].dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(service.isCloseScheduled).toBeTrue();

    // Pointer arrives in the panel mid-flight — the close must be dropped.
    panels()[0].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(service.isCloseScheduled).toBeFalse();

    tick(500);
    fixture.detectChanges();
    expect(service.openId).toBe('products');

    // Leaving the panel schedules the close again.
    panels()[0].dispatchEvent(new MouseEvent('mouseleave'));
    tick(150);
    fixture.detectChanges();
    expect(service.openId).toBeNull();
  }));

  it('cancels the pending close when the same trigger is re-entered', fakeAsync(() => {
    triggers()[0].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    triggers()[0].dispatchEvent(new MouseEvent('mouseleave'));
    expect(service.isCloseScheduled).toBeTrue();

    triggers()[0].dispatchEvent(new MouseEvent('mouseenter'));
    expect(service.isCloseScheduled).toBeFalse();

    tick(500);
    fixture.detectChanges();
    expect(service.openId).toBe('products');
  }));

  it('honours a custom closeDelay input', fakeAsync(() => {
    host.closeDelay = 400;
    fixture.detectChanges();
    expect(service.closeDelay).toBe(400);

    triggers()[0].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    triggers()[0].dispatchEvent(new MouseEvent('mouseleave'));

    tick(200);
    expect(service.openId).toBe('products');
    tick(200);
    fixture.detectChanges();
    expect(service.openId).toBeNull();
  }));

  it('moving to another trigger swaps the open panel immediately', () => {
    triggers()[0].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    triggers()[0].dispatchEvent(new MouseEvent('mouseleave'));
    triggers()[1].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(service.openId).toBe('company');
    expect(service.isCloseScheduled).toBeFalse();
    expect(panels().length).toBe(1);
  });

  it('closes on Escape', () => {
    triggers()[0].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
    nav.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(service.openId).toBeNull();
    expect(panels().length).toBe(0);
  });

  it('closes on an outside pointerdown', () => {
    triggers()[0].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    fixture.detectChanges();

    expect(service.openId).toBeNull();
  });

  it('renders links with href and active state', () => {
    triggers()[1].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector(
      'tolle-navigation-menu-link a'
    );
    expect(link.getAttribute('href')).toBe('/about');
    expect(link.getAttribute('aria-current')).toBe('page');
    expect(link.className).toContain('bg-accent');
  });
});

describe('NavigationMenuService', () => {
  let service: NavigationMenuService;

  beforeEach(() => {
    service = new NavigationMenuService();
  });

  afterEach(() => service.cancelClose());

  it('open cancels a scheduled close', fakeAsync(() => {
    service.open('a');
    service.scheduleClose();
    expect(service.isCloseScheduled).toBeTrue();

    service.open('b');
    expect(service.isCloseScheduled).toBeFalse();

    tick(500);
    expect(service.openId).toBe('b');
  }));

  it('scheduleClose replaces an earlier pending close rather than stacking', fakeAsync(() => {
    service.open('a');
    service.scheduleClose();
    tick(100);
    service.scheduleClose();
    tick(100);
    expect(service.openId).toBe('a');
    tick(50);
    expect(service.openId).toBeNull();
  }));
});
