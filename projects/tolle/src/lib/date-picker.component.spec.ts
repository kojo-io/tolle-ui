import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DatePickerComponent } from './date-picker.component';
import { CalendarComponent } from './calendar.component';

/**
 * The trigger is a button — the same mechanism as `tolle-date-time-picker`,
 * not a typeable masked field. These tests pin that shape and the panel
 * behaviour built on top of it.
 */
describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /** The single trigger `<button>`. */
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

  /** The calendar inside the popover, once it is open. */
  function calendar(): CalendarComponent {
    const found = fixture.debugElement.query(By.directive(CalendarComponent));
    if (!found) throw new Error('calendar did not render');
    return found.componentInstance as CalendarComponent;
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

    it('shows the placeholder until a value is set', () => {
      expect(triggerEl().textContent).toContain(component.placeholder);
    });

    it('renders the formatted value once one is set', () => {
      component.writeValue(new Date(2024, 0, 15));
      fixture.detectChanges();

      expect(component.displayValue).toBe('Jan 15, 2024');
      expect(triggerEl().textContent).toContain('Jan 15, 2024');
    });

    it('formats according to mode', () => {
      fixture.componentRef.setInput('mode', 'month');
      fixture.detectChanges();
      expect(component.formatDate(new Date(2024, 0, 15))).toBe('January 2024');

      fixture.componentRef.setInput('mode', 'year');
      fixture.detectChanges();
      expect(component.formatDate(new Date(2024, 0, 15))).toBe('2024');
    });

    it('hands formatting to displayFormat when one is supplied', () => {
      const displayFormat = jasmine
        .createSpy('displayFormat')
        .and.returnValue('custom label');
      fixture.componentRef.setInput('displayFormat', displayFormat);
      fixture.detectChanges();

      component.writeValue(new Date(2024, 0, 15));
      fixture.detectChanges();

      expect(displayFormat).toHaveBeenCalledWith(jasmine.any(Date), 'date');
      expect(component.displayValue).toBe('custom label');
      expect(triggerEl().textContent).toContain('custom label');
    });

    it('merges the class input onto the trigger', () => {
      fixture.componentRef.setInput('class', 'text-red-500');
      fixture.detectChanges();

      expect(triggerEl().className).toContain('text-red-500');
    });
  });

  describe('ControlValueAccessor', () => {
    it('round-trips a Date through writeValue', () => {
      const date = new Date(2024, 0, 15, 13, 45);
      component.writeValue(date);

      // Normalised to the start of the day.
      expect(component.value!.getFullYear()).toBe(2024);
      expect(component.value!.getMonth()).toBe(0);
      expect(component.value!.getDate()).toBe(15);
      expect(component.value!.getHours()).toBe(0);
    });

    it('accepts an ISO string', () => {
      component.writeValue(new Date(2024, 0, 15).toISOString());

      expect(component.value).not.toBeNull();
      expect(component.value!.getDate()).toBe(15);
    });

    it('treats null as no selection', () => {
      component.writeValue(new Date(2024, 0, 15));
      component.writeValue(null);

      expect(component.value).toBeNull();
      expect(component.displayValue).toBe('');
    });

    it('treats an invalid value as no selection', () => {
      component.writeValue(new Date(2024, 0, 15));
      component.writeValue('not a date');

      expect(component.value).toBeNull();
    });

    it('reports a calendar selection through registerOnChange', fakeAsync(() => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      openPanel();
      component.onCalendarChange(new Date(2024, 0, 15));
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalled();
      const emitted = onChange.calls.mostRecent().args[0] as Date;
      expect(emitted.getDate()).toBe(15);
      // Picking a day closes the popover.
      expect(component.isOpen).toBe(false);
    }));

    it('reports a cleared calendar selection as null', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      component.writeValue(new Date(2024, 0, 15));
      component.onCalendarChange(null);

      expect(onChange).toHaveBeenCalledWith(null);
      expect(component.value).toBeNull();
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

    it('does not reopen a key event while already open', fakeAsync(() => {
      openPanel();
      const spy = spyOn(component, 'open').and.callThrough();

      triggerEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      tick(20);

      expect(spy).not.toHaveBeenCalled();
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
      component.setDisabledState(true);
      fixture.detectChanges();

      component.open();
      tick();
      fixture.detectChanges();

      expect(component.isOpen).toBe(false);
    }));
  });

  describe('the popover', () => {
    it('starts closed and renders no calendar', () => {
      expect(component.isOpen).toBe(false);
      expect(fixture.nativeElement.querySelector('tolle-calendar')).toBeNull();
    });

    it('opens on a trigger click and renders the calendar', fakeAsync(() => {
      expect(triggerEl().getAttribute('aria-expanded')).toBe('false');
      expect(triggerEl().getAttribute('aria-haspopup')).toBe('dialog');

      triggerEl().click();
      tick(20);
      fixture.detectChanges();

      expect(component.isOpen).toBe(true);
      expect(fixture.nativeElement.querySelector('tolle-calendar')).toBeTruthy();
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
      expect(fixture.nativeElement.querySelector('tolle-calendar')).toBeNull();
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
      expect(fixture.nativeElement.querySelector('tolle-calendar')).toBeNull();
    }));

    it('closes on an outside pointerdown', fakeAsync(() => {
      openPanel();
      expect(component.isOpen).toBe(true);

      document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
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
    it('forwards mode and past-date blocking', fakeAsync(() => {
      fixture.componentRef.setInput('mode', 'month');
      fixture.componentRef.setInput('disablePastDates', true);
      fixture.detectChanges();

      openPanel();

      expect(calendar().mode).toBe('month');
      expect(calendar().disablePastDates).toBe(true);
    }));

    it('defaults past dates enabled and date mode', fakeAsync(() => {
      openPanel();

      expect(calendar().disablePastDates).toBe(false);
      expect(calendar().mode).toBe('date');
    }));

    it("always turns the calendar's own quick-action row off", fakeAsync(() => {
      // The panel owns Clear/Done in its footer, matching the date-time picker.
      // Leaving the calendar's internal row on would show two of them.
      openPanel();

      expect(calendar().showQuickActions).toBe(false);
    }));

    it('renders the footer when showQuickActions is on, and drops it when off', fakeAsync(() => {
      openPanel();
      const footer = () => fixture.nativeElement.querySelector('[role=dialog] .border-t');
      expect(footer()).toBeTruthy();
      expect(footer().textContent).toContain('Clear');
      expect(footer().textContent).toContain('Done');

      component.close();
      tick();
      fixture.componentRef.setInput('showQuickActions', false);
      fixture.detectChanges();
      openPanel();

      expect(fixture.nativeElement.querySelector('[role=dialog] .border-t')).toBeNull();
    }));

    it('hides the footer Clear button when showClear is false, keeping Done', fakeAsync(() => {
      fixture.componentRef.setInput('showClear', false);
      fixture.detectChanges();
      openPanel();

      const footer = fixture.nativeElement.querySelector('[role=dialog] .border-t');
      expect(footer.textContent).not.toContain('Clear');
      expect(footer.textContent).toContain('Done');
    }));

    it('forwards the minDate and maxDate bounds', fakeAsync(() => {
      const min = new Date(2024, 0, 10);
      const max = new Date(2024, 0, 20);
      fixture.componentRef.setInput('minDate', min);
      fixture.componentRef.setInput('maxDate', max);
      fixture.detectChanges();

      openPanel();

      expect(calendar().minDate).toBe(min);
      expect(calendar().maxDate).toBe(max);
      // The bounds actually bite in the calendar.
      expect(calendar().isDateDisabled(new Date(2024, 0, 9))).toBe(true);
      expect(calendar().isDateDisabled(new Date(2024, 0, 15))).toBe(false);
      expect(calendar().isDateDisabled(new Date(2024, 0, 21))).toBe(true);
    }));

    it('forwards the formatMonthFn and formatYearFn hooks', fakeAsync(() => {
      const formatMonthFn = (d: Date) => 'M:' + d.getMonth();
      const formatYearFn = (d: Date) => 'Y:' + d.getFullYear();
      fixture.componentRef.setInput('formatMonthFn', formatMonthFn);
      fixture.componentRef.setInput('formatYearFn', formatYearFn);
      fixture.detectChanges();

      openPanel();

      expect(calendar().formatMonthFn).toBe(formatMonthFn);
      expect(calendar().formatYearFn).toBe(formatYearFn);
      expect(calendar().formatMonthYear(new Date(2024, 2, 1), 'month')).toBe('M:2');
      expect(calendar().formatMonthYear(new Date(2024, 2, 1), 'year')).toBe('Y:2024');
    }));

    it('seeds the calendar with the current value', fakeAsync(() => {
      component.writeValue(new Date(2024, 0, 15));
      fixture.detectChanges();

      openPanel();

      expect(calendar().selectedDate).not.toBeNull();
      expect(calendar().selectedDate!.getDate()).toBe(15);
    }));
  });

  describe('footer actions', () => {
    it('Clear empties the value and leaves the panel open', fakeAsync(() => {
      component.writeValue(new Date(2024, 0, 15));
      fixture.detectChanges();
      openPanel();

      const clearBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[role=dialog] .border-t button'
      );
      expect(clearBtn.textContent).toContain('Clear');
      clearBtn.click();
      fixture.detectChanges();

      expect(component.value).toBeNull();
      expect(component.isOpen).toBe(true);
    }));

    it('Done closes the panel without changing the value', fakeAsync(() => {
      component.writeValue(new Date(2024, 0, 15));
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
      expect(component.value!.getDate()).toBe(15);
    }));
  });

  describe('outputs', () => {
    it('emits valueChange alongside the form onChange', fakeAsync(() => {
      const valueChange = jasmine.createSpy('valueChange');
      component.valueChange.subscribe(valueChange);

      openPanel();
      component.onCalendarChange(new Date(2024, 0, 15));

      expect(valueChange).toHaveBeenCalled();
      expect((valueChange.calls.mostRecent().args[0] as Date).getDate()).toBe(15);
    }));

    it('emits valueChange with null on the footer clear', fakeAsync(() => {
      const valueChange = jasmine.createSpy('valueChange');
      component.writeValue(new Date(2024, 0, 15));
      fixture.detectChanges();
      openPanel();
      component.valueChange.subscribe(valueChange);

      component.clearFromFooter();

      expect(valueChange).toHaveBeenCalledWith(null);
    }));

    it('stays silent on writeValue, as the CVA contract requires', () => {
      const valueChange = jasmine.createSpy('valueChange');
      component.valueChange.subscribe(valueChange);

      component.writeValue(new Date(2024, 0, 15));

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

describe('DatePickerComponent panel anchoring', () => {
  let fixture: ComponentFixture<DatePickerComponent>;
  let component: DatePickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DatePickerComponent] }).compileComponents();
    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * The panel used to be positioned against a small calendar icon inside a
   * separate masked-input field, so it opened detached from the control. Now
   * the trigger IS the field — there is nothing else to anchor to or drift
   * from, exactly like tolle-date-time-picker.
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
