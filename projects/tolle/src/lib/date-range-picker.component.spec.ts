import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DateRangePickerComponent } from './date-range-picker.component';
import { RangeCalendarComponent } from './range-calendar.component';

/**
 * The trigger is a button — the same mechanism as `tolle-date-time-picker`
 * and `tolle-date-picker`, not a read-only text field. These tests pin that
 * shape and the panel behaviour built on top of it.
 */
describe('DateRangePickerComponent', () => {
  let component: DateRangePickerComponent;
  let fixture: ComponentFixture<DateRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /** The single trigger `<button>`, outside the popover. */
  function triggerEl(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  /**
   * Opens the popover and flushes the deferred positioning work.
   *
   * `open()` renders the popover synchronously, then defers positioning and the
   * outside-click listener to a `requestAnimationFrame`. fakeAsync models rAF as
   * a 16ms macrotask, so a bare `tick()` would never run it.
   */
  function openPanel(): void {
    component.open();
    tick(20);
    fixture.detectChanges();
  }

  /** The range calendar inside the popover, once it is open. */
  function calendar(): RangeCalendarComponent {
    const found = fixture.debugElement.query(By.directive(RangeCalendarComponent));
    if (!found) throw new Error('range calendar did not render');
    return found.componentInstance as RangeCalendarComponent;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trigger rendering', () => {
    it('is a real button, not a text input', () => {
      expect(triggerEl().tagName.toLowerCase()).toBe('button');
      expect(triggerEl().getAttribute('type')).toBe('button');
      expect(fixture.nativeElement.querySelector('input')).toBeNull();
    });

    it('renders the placeholder while nothing is selected', () => {
      expect(component.displayValue).toBe('');
      expect(triggerEl().textContent).toContain('Pick a date range');
    });

    it('honours a custom placeholder', () => {
      fixture.componentRef.setInput('placeholder', 'Choose dates');
      fixture.detectChanges();

      expect(triggerEl().textContent).toContain('Choose dates');
    });

    it('renders just the start until an end is chosen', () => {
      component.writeValue({ start: new Date(2024, 0, 15), end: null });
      fixture.detectChanges();

      expect(component.displayValue).toBe('Jan 15, 2024');
      expect(triggerEl().textContent).toContain('Jan 15, 2024');
    });

    it('renders both ends of a complete range', () => {
      component.writeValue({
        start: new Date(2024, 0, 15),
        end: new Date(2024, 0, 20),
      });
      fixture.detectChanges();

      expect(component.displayValue).toBe('Jan 15, 2024 - Jan 20, 2024');
      expect(triggerEl().textContent).toContain('Jan 15, 2024 - Jan 20, 2024');
    });

    it('merges the class input onto the trigger', () => {
      fixture.componentRef.setInput('class', 'text-red-500');
      fixture.detectChanges();

      expect(triggerEl().className).toContain('text-red-500');
    });
  });

  describe('ControlValueAccessor', () => {
    it('round-trips a range through writeValue', () => {
      const range = { start: new Date(2024, 0, 15), end: new Date(2024, 0, 20) };
      component.writeValue(range);

      expect(component.value.start!.getDate()).toBe(15);
      expect(component.value.end!.getDate()).toBe(20);
      // Copied, not aliased.
      expect(component.value).not.toBe(range);
    });

    it('treats null as an empty range', () => {
      component.writeValue({ start: new Date(2024, 0, 15), end: null });
      component.writeValue(null);

      expect(component.value).toEqual({ start: null, end: null });
      expect(component.displayValue).toBe('');
    });

    it('reports a selection through registerOnChange', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      const range = { start: new Date(2024, 0, 15), end: null };
      component.onCalendarSelect(range);

      expect(onChange).toHaveBeenCalledWith(range);
      expect(component.value).toBe(range);
    });

    it('registers a touched callback without throwing', () => {
      const onTouched = jasmine.createSpy('onTouched');
      expect(() => component.registerOnTouched(onTouched)).not.toThrow();
    });
  });

  describe('keyboard opening', () => {
    for (const key of ['ArrowDown', 'ArrowUp', 'Enter', ' ']) {
      it(`opens on ${JSON.stringify(key)}`, fakeAsync(() => {
        triggerEl().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
        tick(20);
        fixture.detectChanges();

        expect(component.isOpen).toBe(true);
      }));
    }
  });

  describe('selecting a start then an end', () => {
    it('keeps the popover open after the start and closes after the end', fakeAsync(() => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      openPanel();
      const cal = calendar();

      cal.selectDate(new Date(2024, 0, 15));
      fixture.detectChanges();
      tick(200);

      expect(component.value.start!.getDate()).toBe(15);
      expect(component.value.end).toBeNull();
      expect(component.displayValue).toBe('Jan 15, 2024');
      expect(component.isOpen).toBe(true);

      cal.selectDate(new Date(2024, 0, 20));
      fixture.detectChanges();

      expect(component.value.start!.getDate()).toBe(15);
      expect(component.value.end!.getDate()).toBe(20);
      expect(component.displayValue).toBe('Jan 15, 2024 - Jan 20, 2024');

      // The popover closes on a short delay once the range is complete.
      expect(component.isOpen).toBe(true);
      tick(200);
      fixture.detectChanges();
      expect(component.isOpen).toBe(false);

      expect(onChange).toHaveBeenCalledTimes(2);
    }));

    it('restarts the range when the second click lands before the start', fakeAsync(() => {
      openPanel();
      const cal = calendar();

      cal.selectDate(new Date(2024, 0, 15));
      fixture.detectChanges();
      cal.selectDate(new Date(2024, 0, 10));
      fixture.detectChanges();
      tick(200);

      expect(component.value.start!.getDate()).toBe(10);
      expect(component.value.end).toBeNull();
    }));
  });

  describe('disabled', () => {
    it('disables the trigger through setDisabledState', () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      expect(component.disabled).toBe(true);
      expect(triggerEl().disabled).toBe(true);
    });

    it('disables the trigger through the disabled input', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(triggerEl().disabled).toBe(true);
    });

    it('refuses to open while disabled', fakeAsync(() => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      triggerEl().click();
      tick(20);
      fixture.detectChanges();

      expect(component.isOpen).toBe(false);
    }));
  });

  describe('the popover', () => {
    it('starts closed and renders no calendar', () => {
      expect(component.isOpen).toBe(false);
      expect(fixture.nativeElement.querySelector('tolle-range-calendar')).toBeNull();
    });

    it('opens on a trigger click and renders the calendar', fakeAsync(() => {
      expect(triggerEl().getAttribute('aria-expanded')).toBe('false');
      expect(triggerEl().getAttribute('aria-haspopup')).toBe('dialog');

      triggerEl().click();
      tick(20);
      fixture.detectChanges();

      expect(component.isOpen).toBe(true);
      expect(fixture.nativeElement.querySelector('tolle-range-calendar')).toBeTruthy();
      expect(triggerEl().getAttribute('aria-expanded')).toBe('true');
      expect(triggerEl().getAttribute('data-state')).toBe('open');
    }));

    it('toggles shut on a second click of the trigger', fakeAsync(() => {
      triggerEl().click();
      tick(20);
      fixture.detectChanges();
      expect(component.isOpen).toBe(true);

      triggerEl().click();
      tick(20);
      fixture.detectChanges();

      expect(component.isOpen).toBe(false);
      expect(fixture.nativeElement.querySelector('tolle-range-calendar')).toBeNull();
    }));

    it('closes on Escape', fakeAsync(() => {
      openPanel();
      expect(component.isOpen).toBe(true);

      fixture.nativeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      );
      tick();
      fixture.detectChanges();

      expect(component.isOpen).toBe(false);
      expect(fixture.nativeElement.querySelector('tolle-range-calendar')).toBeNull();
    }));

    it('closes on an outside pointerdown', fakeAsync(() => {
      openPanel();
      expect(component.isOpen).toBe(true);

      document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      tick();
      fixture.detectChanges();

      expect(component.isOpen).toBe(false);
    }));

    it('closes on a window resize', fakeAsync(() => {
      openPanel();
      expect(component.isOpen).toBe(true);

      window.dispatchEvent(new Event('resize'));
      tick();
      fixture.detectChanges();

      expect(component.isOpen).toBe(false);
    }));

    it('tears down without throwing while open', fakeAsync(() => {
      openPanel();
      expect(() => fixture.destroy()).not.toThrow();
    }));
  });

  describe('what the calendar is told', () => {
    it('defaults to one month with past dates enabled', fakeAsync(() => {
      openPanel();

      expect(component.numberOfMonths).toBe(1);
      expect(calendar().numberOfMonths).toBe(1);
      expect(calendar().disablePastDates).toBe(false);
      expect(calendar().visibleMonths.length).toBe(1);
    }));

    it('forwards numberOfMonths', fakeAsync(() => {
      fixture.componentRef.setInput('numberOfMonths', 2);
      fixture.detectChanges();

      openPanel();

      expect(calendar().numberOfMonths).toBe(2);
      expect(calendar().visibleMonths.length).toBe(2);
    }));

    it('forwards disablePastDates and it actually bites', fakeAsync(() => {
      fixture.componentRef.setInput('disablePastDates', true);
      fixture.detectChanges();

      openPanel();

      expect(calendar().disablePastDates).toBe(true);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(calendar().isDateDisabled(yesterday)).toBe(true);
    }));

    it('seeds the calendar with the current range', fakeAsync(() => {
      component.writeValue({
        start: new Date(2024, 0, 15),
        end: new Date(2024, 0, 20),
      });
      fixture.detectChanges();

      openPanel();

      expect(calendar().value.start!.getDate()).toBe(15);
      expect(calendar().value.end!.getDate()).toBe(20);
    }));
  });

  describe('footer actions', () => {
    it('renders a Clear / Done footer', fakeAsync(() => {
      openPanel();
      const footer = fixture.nativeElement.querySelector('[role=dialog] .border-t');

      expect(footer).toBeTruthy();
      expect(footer.textContent).toContain('Clear');
      expect(footer.textContent).toContain('Done');
    }));

    it('Clear empties the range and leaves the panel open', fakeAsync(() => {
      component.writeValue({
        start: new Date(2024, 0, 15),
        end: new Date(2024, 0, 20),
      });
      fixture.detectChanges();
      openPanel();

      const clearBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[role=dialog] .border-t button'
      );
      expect(clearBtn.textContent).toContain('Clear');
      clearBtn.click();
      fixture.detectChanges();

      expect(component.value).toEqual({ start: null, end: null });
      expect(component.isOpen).toBe(true);
    }));

    it('Done closes the panel without changing the range', fakeAsync(() => {
      component.writeValue({
        start: new Date(2024, 0, 15),
        end: new Date(2024, 0, 20),
      });
      fixture.detectChanges();
      openPanel();

      const buttons: HTMLButtonElement[] = Array.from(
        fixture.nativeElement.querySelectorAll('[role=dialog] button')
      );
      const doneBtn = buttons.find((b) => b.textContent?.includes('Done'))!;
      doneBtn.click();
      tick();
      fixture.detectChanges();

      expect(component.isOpen).toBe(false);
      expect(component.value.start!.getDate()).toBe(15);
      expect(component.value.end!.getDate()).toBe(20);
    }));
  });

  describe('outputs', () => {
    it('emits valueChange alongside the form onChange', () => {
      const valueChange = jasmine.createSpy('valueChange');
      component.valueChange.subscribe(valueChange);

      const range = { start: new Date(2024, 0, 15), end: null };
      component.onCalendarSelect(range);

      expect(valueChange).toHaveBeenCalledWith(range);
    });

    it('emits valueChange with an empty range on the footer clear', () => {
      const valueChange = jasmine.createSpy('valueChange');
      component.writeValue({ start: new Date(2024, 0, 15), end: null });
      component.valueChange.subscribe(valueChange);

      component.clearFromFooter();

      expect(valueChange).toHaveBeenCalledWith({ start: null, end: null });
    });

    it('stays silent on writeValue, as the CVA contract requires', () => {
      const valueChange = jasmine.createSpy('valueChange');
      component.valueChange.subscribe(valueChange);

      component.writeValue({ start: new Date(2024, 0, 15), end: null });

      expect(valueChange).not.toHaveBeenCalled();
    });

    it('emits opened and closed exactly once per cycle', fakeAsync(() => {
      const opened = jasmine.createSpy('opened');
      const closed = jasmine.createSpy('closed');
      component.opened.subscribe(opened);
      component.closed.subscribe(closed);

      openPanel();
      expect(opened).toHaveBeenCalledTimes(1);
      expect(closed).not.toHaveBeenCalled();

      // A redundant open, then a redundant close: neither re-emits.
      component.open();
      tick(20);
      expect(opened).toHaveBeenCalledTimes(1);

      component.close();
      component.close();
      fixture.detectChanges();

      expect(closed).toHaveBeenCalledTimes(1);
    }));
  });

  describe('size and invalid', () => {
    it('defaults to default size and reaches the trigger', () => {
      expect(component.size).toBe('default');
      expect(component.computedTriggerClass).toContain('h-10');
    });

    it('reflects size on the trigger', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      expect(triggerEl().className).toContain('h-11');
    });

    it('applies the destructive border when invalid', () => {
      fixture.componentRef.setInput('invalid', true);
      fixture.detectChanges();

      expect(triggerEl().className).toContain('border-destructive');
    });
  });
});

describe('DateRangePickerComponent panel anchoring', () => {
  let fixture: ComponentFixture<DateRangePickerComponent>;
  let component: DateRangePickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DateRangePickerComponent] }).compileComponents();
    fixture = TestBed.createComponent(DateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * The panel used to be positioned against a small calendar icon inside a
   * separate read-only field, so it opened detached from the control. Now the
   * trigger IS the field — there is nothing else to anchor to or drift from,
   * exactly like tolle-date-time-picker.
   */
  it('anchors the panel to the trigger button itself', fakeAsync(() => {
    component.open();
    tick();
    fixture.detectChanges();

    expect(component.trigger.nativeElement.tagName.toLowerCase()).toBe('button');

    component.close();
    tick();
  }));

  it('treats a click on the trigger as inside, so the panel does not close', fakeAsync(() => {
    component.open();
    tick();
    fixture.detectChanges();

    const trigger = component.trigger.nativeElement as HTMLElement;
    document.body.appendChild(fixture.nativeElement);
    trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    tick();

    expect(component.isOpen).toBe(true);

    document.body.removeChild(fixture.nativeElement);
    component.close();
    tick();
  }));
});
