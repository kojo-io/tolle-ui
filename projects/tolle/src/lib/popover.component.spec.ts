import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PopoverComponent } from './popover.component';

describe('PopoverComponent', () => {
  let component: PopoverComponent;
  let fixture: ComponentFixture<PopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('closes when a pointerdown lands outside the trigger and panel', fakeAsync(() => {
    component.open();
    tick();
    fixture.detectChanges();
    expect(component.isOpen).toBeTrue();

    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    fixture.detectChanges();

    expect(component.isOpen).toBeFalse();
    outside.remove();
  }));

  it('stays open when the pointerdown is inside the trigger', fakeAsync(() => {
    component.open();
    tick();
    fixture.detectChanges();

    component.triggerEl.nativeElement.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true })
    );
    fixture.detectChanges();

    // The trigger's own (click) handler owns toggling; the outside handler must not fire.
    expect(component.isOpen).toBeTrue();
  }));

  it('closes on Escape', fakeAsync(() => {
    component.open();
    tick();
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(component.isOpen).toBeFalse();
  }));
});

/**
 * Regression: modal, sheet and country-selector call stopPropagation() on
 * mousedown at their root. While dismissal listened on bubble-phase mousedown,
 * any overlay nested inside them could only be closed by re-clicking its
 * trigger. Capture-phase pointerdown must be immune to that.
 */
@Component({
  standalone: true,
  imports: [PopoverComponent],
  template: `
    <div class="blocker" (mousedown)="$event.stopPropagation()" (pointerdown)="$event.stopPropagation()">
      <tolle-popover></tolle-popover>
    </div>
  `
})
class BlockingHostComponent {
  @ViewChild(PopoverComponent) popover!: PopoverComponent;
}

describe('PopoverComponent inside a propagation-blocking container', () => {
  it('still closes on outside click', fakeAsync(() => {
    const hostFixture = TestBed.createComponent(BlockingHostComponent);
    hostFixture.detectChanges();

    const popover = hostFixture.componentInstance.popover;
    popover.open();
    tick();
    hostFixture.detectChanges();
    expect(popover.isOpen).toBeTrue();

    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    hostFixture.detectChanges();

    expect(popover.isOpen).toBeFalse();
    outside.remove();
  }));
});
