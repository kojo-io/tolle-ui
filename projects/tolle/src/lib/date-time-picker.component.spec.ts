import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DateTimePickerComponent } from './date-time-picker.component';
import { TimeColumn, TimeColumnKind, TimeColumnsComponent, TimeOption } from './time-picker.component';

function columnOf(columns: TimeColumn[], kind: TimeColumnKind): TimeColumn {
  const column = columns.find((c) => c.kind === kind);
  if (!column) throw new Error('no ' + kind + ' column');
  return column;
}

function optionByLabel(column: TimeColumn, label: string): TimeOption {
  const option = column.options.find((o) => o.label === label);
  if (!option) throw new Error('no option labelled ' + label + ' in ' + column.kind);
  return option;
}

describe('DateTimePickerComponent', () => {
  let component: DateTimePickerComponent;
  let fixture: ComponentFixture<DateTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DateTimePickerComponent] }).compileComponents();
    fixture = TestBed.createComponent(DateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /** Opens the panel and flushes the deferred positioning work. */
  function openPanel(): TimeColumnsComponent {
    component.open();
    tick();
    fixture.detectChanges();
    tick();
    if (!component.columnsCmp) throw new Error('time columns did not render');
    return component.columnsCmp;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the placeholder until a value is set', () => {
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(trigger.textContent).toContain(component.placeholder);
  });

  describe('ControlValueAccessor', () => {
    it('round-trips a Date', () => {
      const moment = new Date(2024, 0, 15, 14, 30, 0);
      component.writeValue(moment);
      fixture.detectChanges();

      expect(component.value).toBe(moment);
      expect(component.hour).toBe(14);
      expect(component.minute).toBe(30);
      expect(component.displayValue).toBe('Jan 15, 2024 2:30 PM');
    });

    it('renders the trigger with a custom displayFormat', () => {
      fixture.componentRef.setInput('displayFormat', 'yyyy-MM-dd HH:mm');
      component.writeValue(new Date(2024, 0, 15, 14, 30));
      fixture.detectChanges();

      expect(component.displayValue).toBe('2024-01-15 14:30');
      const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(trigger.textContent).toContain('2024-01-15 14:30');
    });

    it('falls back to a readable string when displayFormat is invalid', () => {
      fixture.componentRef.setInput('displayFormat', 'YYYY-nonsense-Q');
      component.writeValue(new Date(2024, 0, 15, 14, 30));
      fixture.detectChanges();

      expect(component.displayValue).toContain('Jan 15, 2024');
    });

    it('treats null and an invalid value as no selection', () => {
      component.writeValue(new Date(2024, 0, 15, 14, 30));
      component.writeValue(null);
      expect(component.value).toBeNull();

      component.writeValue(new Date('not a date'));
      expect(component.value).toBeNull();
      expect(component.displayValue).toBe('');
    });

    it('accepts an ISO string', () => {
      component.writeValue(new Date(2024, 0, 15, 14, 30).toISOString());
      expect(component.value).not.toBeNull();
      expect(component.value!.getHours()).toBe(14);
    });

    it('disables the trigger through setDisabledState', () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(component.disabled).toBe(true);
      expect(trigger.disabled).toBe(true);
    });

    it('marks the control touched on close', fakeAsync(() => {
      const onTouched = jasmine.createSpy('onTouched');
      component.registerOnTouched(onTouched);
      openPanel();

      component.close();

      expect(onTouched).toHaveBeenCalled();
    }));
  });

  describe('the two halves do not clobber each other', () => {
    it('keeps the chosen time when the date changes', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      component.writeValue(new Date(2024, 0, 15, 14, 30, 45));
      fixture.detectChanges();

      component.onDateSelect(new Date(2024, 1, 20));

      const next = onChange.calls.mostRecent().args[0] as Date;
      expect(next.getFullYear()).toBe(2024);
      expect(next.getMonth()).toBe(1);
      expect(next.getDate()).toBe(20);
      expect(next.getHours()).toBe(14);
      expect(next.getMinutes()).toBe(30);
      expect(next.getSeconds()).toBe(45);
    });

    it('keeps the chosen date when the time changes', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      component.writeValue(new Date(2024, 0, 15, 14, 30));
      fixture.detectChanges();

      component.onTimeChange({ hour: 9, minute: 5, second: 0 });

      const next = onChange.calls.mostRecent().args[0] as Date;
      expect(next.getFullYear()).toBe(2024);
      expect(next.getMonth()).toBe(0);
      expect(next.getDate()).toBe(15);
      expect(next.getHours()).toBe(9);
      expect(next.getMinutes()).toBe(5);
    });

    it('survives an alternating date, time, date sequence', () => {
      component.writeValue(new Date(2024, 0, 15, 14, 30));
      fixture.detectChanges();

      component.onDateSelect(new Date(2024, 2, 3));
      component.onTimeChange({ hour: 22, minute: 15, second: 0 });
      component.onDateSelect(new Date(2024, 5, 9));

      const value = component.value!;
      expect(value.getMonth()).toBe(5);
      expect(value.getDate()).toBe(9);
      expect(value.getHours()).toBe(22);
      expect(value.getMinutes()).toBe(15);
    });

    it('starts a first date pick at midnight', () => {
      component.onDateSelect(new Date(2024, 0, 15));

      expect(component.value!.getHours()).toBe(0);
      expect(component.value!.getMinutes()).toBe(0);
    });

    it('lands a first time pick on today', () => {
      const today = new Date();
      component.onTimeChange({ hour: 11, minute: 45, second: 0 });

      const value = component.value!;
      expect(value.getDate()).toBe(today.getDate());
      expect(value.getMonth()).toBe(today.getMonth());
      expect(value.getHours()).toBe(11);
      expect(value.getMinutes()).toBe(45);
    });

    it('feeds the time columns from the current value', fakeAsync(() => {
      component.writeValue(new Date(2024, 0, 15, 14, 30));
      fixture.detectChanges();

      const columns = openPanel();
      const hours = columnOf(columns.columns, 'hour');
      const minutes = columnOf(columns.columns, 'minute');

      expect(columns.isSelected(hours, optionByLabel(hours, '14'))).toBe(true);
      expect(columns.isSelected(minutes, optionByLabel(minutes, '30'))).toBe(true);
    }));

    it('commits a time picked through the columns', fakeAsync(() => {
      component.writeValue(new Date(2024, 0, 15, 14, 30));
      fixture.detectChanges();

      const columns = openPanel();
      const minutes = columnOf(columns.columns, 'minute');
      columns.choose(minutes, optionByLabel(minutes, '45'), 1);

      expect(component.value!.getMinutes()).toBe(45);
      expect(component.value!.getDate()).toBe(15);
    }));
  });

  describe('clearing', () => {
    it('emits null through the CVA and the output', () => {
      const onChange = jasmine.createSpy('onChange');
      const valueChange = jasmine.createSpy('valueChange');
      component.registerOnChange(onChange);
      component.valueChange.subscribe(valueChange);

      component.writeValue(new Date(2024, 0, 15, 14, 30));
      component.clear();

      expect(component.value).toBeNull();
      expect(onChange).toHaveBeenCalledWith(null);
      expect(valueChange).toHaveBeenCalledWith(null);
    });

    it('closes the panel so the calendar is rebuilt clean', fakeAsync(() => {
      component.writeValue(new Date(2024, 0, 15, 14, 30));
      fixture.detectChanges();
      openPanel();

      component.clear();
      fixture.detectChanges();

      expect(component.isOpen).toBe(false);
      expect(component.displayValue).toBe('');
    }));

    it('treats a null from the calendar as a clear', () => {
      component.writeValue(new Date(2024, 0, 15, 14, 30));
      component.onDateSelect(null);

      expect(component.value).toBeNull();
    });
  });

  describe('min and max bounds', () => {
    const MIN = new Date(2024, 0, 15, 9, 0);
    const MAX = new Date(2024, 0, 20, 17, 0);

    beforeEach(() => {
      fixture.componentRef.setInput('min', MIN);
      fixture.componentRef.setInput('max', MAX);
      fixture.detectChanges();
    });

    it('hands the calendar day-only bounds', () => {
      // A bound carrying a time would make the calendar disable its own boundary day.
      expect(component.calendarMin!.getHours()).toBe(0);
      expect(component.calendarMin!.getDate()).toBe(15);
      expect(component.calendarMax!.getHours()).toBe(0);
      expect(component.calendarMax!.getDate()).toBe(20);
    });

    it('applies the time bound only on the boundary day', () => {
      component.writeValue(new Date(2024, 0, 15, 12, 0)); // the min day
      expect(component.minSeconds).toBe(9 * 3600);
      expect(component.maxSeconds).toBe(24 * 3600 - 1);

      component.writeValue(new Date(2024, 0, 20, 12, 0)); // the max day
      expect(component.minSeconds).toBe(0);
      expect(component.maxSeconds).toBe(17 * 3600);

      component.writeValue(new Date(2024, 0, 17, 12, 0)); // a day in between
      expect(component.minSeconds).toBe(0);
      expect(component.maxSeconds).toBe(24 * 3600 - 1);
    });

    it('disables the out-of-range hours on the boundary day', fakeAsync(() => {
      component.writeValue(new Date(2024, 0, 15, 12, 0));
      fixture.detectChanges();

      const columns = openPanel();
      const hours = columnOf(columns.columns, 'hour');

      expect(optionByLabel(hours, '08').disabled).toBe(true);
      expect(optionByLabel(hours, '09').disabled).toBe(false);
      expect(optionByLabel(hours, '23').disabled).toBe(false);
    }));

    it('leaves the whole day open without bounds', fakeAsync(() => {
      fixture.componentRef.setInput('min', undefined);
      fixture.componentRef.setInput('max', undefined);
      fixture.detectChanges();

      expect(component.minSeconds).toBe(0);
      expect(component.maxSeconds).toBe(24 * 3600 - 1);

      const columns = openPanel();
      expect(columnOf(columns.columns, 'hour').options.every((o) => !o.disabled)).toBe(true);
    }));
  });

  describe('panel composition', () => {
    it('renders a calendar and a time strip side by side', fakeAsync(() => {
      openPanel();

      expect(fixture.nativeElement.querySelector('tolle-calendar')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('tolle-time-columns')).toBeTruthy();
    }));

    it('adds the seconds column when showSeconds is set', fakeAsync(() => {
      fixture.componentRef.setInput('showSeconds', true);
      fixture.detectChanges();

      const columns = openPanel();
      expect(columns.columns.some((c) => c.kind === 'second')).toBe(true);
    }));

    it('adds the meridiem column when use12Hours is set', fakeAsync(() => {
      fixture.componentRef.setInput('use12Hours', true);
      fixture.detectChanges();

      const columns = openPanel();
      expect(columns.columns.some((c) => c.kind === 'meridiem')).toBe(true);
      expect(columnOf(columns.columns, 'hour').options.length).toBe(12);
    }));

    it('passes minuteStep down to the columns', fakeAsync(() => {
      fixture.componentRef.setInput('minuteStep', 30);
      fixture.detectChanges();

      const columns = openPanel();
      expect(columnOf(columns.columns, 'minute').options.length).toBe(2);
    }));

    it('closes on Done and returns focus to the trigger', fakeAsync(() => {
      openPanel();

      component.done();
      fixture.detectChanges();

      expect(component.isOpen).toBe(false);
      expect(document.activeElement).toBe(fixture.nativeElement.querySelector('button'));
    }));
  });

  describe('open state', () => {
    it('reflects open state on aria-expanded and data-state', fakeAsync(() => {
      const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');

      openPanel();

      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(trigger.getAttribute('data-state')).toBe('open');
    }));

    it('closes on Escape and restores focus to the trigger', fakeAsync(() => {
      openPanel();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      tick();
      fixture.detectChanges();

      expect(component.isOpen).toBe(false);
      expect(document.activeElement).toBe(fixture.nativeElement.querySelector('button'));
    }));

    it('closes on an outside pointerdown', fakeAsync(() => {
      openPanel();

      document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      tick();
      fixture.detectChanges();

      expect(component.isOpen).toBe(false);
    }));

    it('does not open while disabled', fakeAsync(() => {
      component.setDisabledState(true);
      fixture.detectChanges();

      component.open();
      tick();

      expect(component.isOpen).toBe(false);
    }));

    it('emits opened and closed', fakeAsync(() => {
      const opened = jasmine.createSpy('opened');
      const closed = jasmine.createSpy('closed');
      component.opened.subscribe(opened);
      component.closed.subscribe(closed);

      openPanel();
      component.close();
      tick();

      expect(opened).toHaveBeenCalled();
      expect(closed).toHaveBeenCalled();
    }));

    it('opens from the keyboard on ArrowDown', fakeAsync(() => {
      component.onTriggerKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      tick();

      expect(component.isOpen).toBe(true);
      component.close();
    }));
  });

  it('applies the invalid styling to the trigger', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();

    expect(component.computedTriggerClass).toContain('border-destructive');
  });

  it('applies the size variant to the trigger', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    expect(component.computedTriggerClass).toContain('h-9');
  });

  it('merges consumer classes last so they win', () => {
    fixture.componentRef.setInput('class', 'h-20');
    fixture.detectChanges();

    expect(component.computedTriggerClass).toContain('h-20');
  });

  it('tears down listeners on destroy without throwing', fakeAsync(() => {
    openPanel();
    expect(() => fixture.destroy()).not.toThrow();
  }));
});
