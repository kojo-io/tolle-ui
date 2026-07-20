import { TestBed } from '@angular/core/testing';

import { ContextMenuService } from './context-menu.service';

function fakeContextMenuEvent(x: number, y: number): MouseEvent {
  return new MouseEvent('contextmenu', { clientX: x, clientY: y, cancelable: true });
}

describe('ContextMenuService', () => {
  let service: ContextMenuService;
  let menu: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextMenuService);

    menu = document.createElement('div');
    menu.style.width = '160px';
    menu.style.height = '120px';
    document.body.appendChild(menu);
  });

  afterEach(() => {
    menu.remove();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('records the click position and opens', () => {
    service.open({ event: fakeContextMenuEvent(150, 200) });
    expect(service['_state']).toEqual(
      jasmine.objectContaining({ x: 150, y: 200, isOpen: true })
    );
  });

  /**
   * Regression guard: the menu used to be positioned with
   * `transform: translate(x, y)`, which collides with the same element's
   * `data-[state=open]:zoom-in-95 slide-in-from-top-2` enter animation — a
   * CSS animation on `transform` overrides an inline `transform` for as
   * long as it's playing, and (because tailwindcss-animate's keyframes only
   * define a `from` state) the missing `to` keyframe implicitly resolves to
   * the inline value, so the animation visibly flew the menu from the
   * origin to its real position instead of just fading/zooming in place.
   * Positioning via left/top instead leaves `transform` free for the
   * animation alone.
   */
  it('positions the menu via left/top, not transform, so it does not collide with the enter animation', async () => {
    service.open({ event: fakeContextMenuEvent(150, 200) });
    await service.positionMenu(menu);

    expect(menu.style.transform).toBe('');
    expect(menu.style.left).not.toBe('0px');
    expect(menu.style.top).not.toBe('0px');
    expect(parseInt(menu.style.left, 10)).toBeGreaterThan(0);
    expect(parseInt(menu.style.top, 10)).toBeGreaterThan(0);
  });

  it('positions a submenu via left/top, not transform', async () => {
    const trigger = document.createElement('button');
    trigger.style.position = 'fixed';
    trigger.style.left = '100px';
    trigger.style.top = '100px';
    trigger.style.width = '80px';
    trigger.style.height = '24px';
    document.body.appendChild(trigger);

    const submenu = document.createElement('div');
    submenu.style.width = '160px';
    submenu.style.height = '120px';
    document.body.appendChild(submenu);

    try {
      await service.positionSubmenu(trigger, submenu);
      expect(submenu.style.transform).toBe('');
      expect(parseInt(submenu.style.left, 10)).toBeGreaterThan(0);
    } finally {
      trigger.remove();
      submenu.remove();
    }
  });
});
