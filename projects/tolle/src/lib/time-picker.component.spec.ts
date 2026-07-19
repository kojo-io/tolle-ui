import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  TimePickerComponent,
  TimeColumnsComponent,
  TimeColumn,
  TimeColumnKind,
  TimeOption,
  parseTimeString,
  formatTimeString,
  to12Hour,
  from12Hour,
} from './time-picker.component';

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

describe('time helpers', () => {
  it('parses HH:mm and HH:mm:ss', () => {
    expect(parseTimeString('14:30')).toEqual({ hour: 14, minute: 30, second: 0 });
    expect(parseTimeString('14:30:09')).toEqual({ hour: 14, minute: 30, second: 9 });
  });

  it('rejects malformed and out-of-range times', () => {
    expect(parseTimeString('24:00')).toBeNull();
    expect(parseTimeString('12:60')).toBeNull();
    expect(parseTimeString('half past two')).toBeNull();
    expect(parseTimeString(null)).toBeNull();
  });

  it('formats with and without seconds', () => {
    expect(formatTimeString({ hour: 9, minute: 5, second: 3 })).toBe('09:05');
    expect(formatTimeString({ hour: 9, minute: 5, second: 3 }, true)).toBe('09:05:03');
  });

  it('maps midnight and noon across the 12-hour boundary', () => {
    expect(to12Hour(0)).toEqual({ hour12: 12, meridiem: 'AM' });
    expect(to12Hour(12)).toEqual({ hour12: 12, meridiem: 'PM' });
    expect(to12Hour(13)).toEqual({ hour12: 1, meridiem: 'PM' });

    expect(from12Hour(12, 'AM')).toBe(0);
    expect(from12Hour(12, 'PM')).toBe(12);
    expect(from12Hour(1, 'PM')).toBe(13);
    expect(from12Hour(11, 'AM')).toBe(11);
  });
});

describe('TimeColumnsComponent', () => {
  let component: TimeColumnsComponent;
  let fixture: ComponentFixture<TimeColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TimeColumnsComponent] }).compileComponents();
    fixture = TestBed.createComponent(TimeColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('option generation', () => {
    it('builds 24 hours and no meridiem column in 24-hour mode', () => {
      const hours = columnOf(component.columns, 'hour');

      expect(hours.options.length).toBe(24);
      expect(hours.options[0].label).toBe('00');
      expect(hours.options[23].label).toBe('23');
      expect(component.columns.some((c) => c.kind === 'meridiem')).toBe(false);
    });

    it('builds a 12-entry clock face plus a meridiem column in 12-hour mode', () => {
      fixture.componentRef.setInput('use12Hours', true);
      fixture.detectChanges();

      const hours = columnOf(component.columns, 'hour');
      expect(hours.options.length).toBe(12);
      // Clock-face order starts at 12, not 01.
      expect(hours.options.map((o) => o.label).slice(0, 3)).toEqual(['12', '01', '02']);

      const meridiem = columnOf(component.columns, 'meridiem');
      expect(meridiem.options.map((o) => o.label)).toEqual(['AM', 'PM']);
    });

    it('omits the seconds column unless showSeconds is set', () => {
      expect(component.columns.some((c) => c.kind === 'second')).toBe(false);

      fixture.componentRef.setInput('showSeconds', true);
      fixture.detectChanges();

      expect(columnOf(component.columns, 'second').options.length).toBe(60);
    });

    it('honours minuteStep', () => {
      expect(columnOf(component.columns, 'minute').options.length).toBe(60);

      fixture.componentRef.setInput('minuteStep', 15);
      fixture.detectChanges();

      const minutes = columnOf(component.columns, 'minute');
      expect(minutes.options.length).toBe(4);
      expect(minutes.options.map((o) => o.label)).toEqual(['00', '15', '30', '45']);
    });

    it('honours secondStep', () => {
      fixture.componentRef.setInput('showSeconds', true);
      fixture.componentRef.setInput('secondStep', 10);
      fixture.detectChanges();

      expect(columnOf(component.columns, 'second').options.length).toBe(6);
    });

    it('falls back to a step of 1 for a nonsensical step', () => {
      fixture.componentRef.setInput('minuteStep', 0);
      fixture.detectChanges();

      expect(columnOf(component.columns, 'minute').options.length).toBe(60);
    });
  });

  describe('min/max disabling', () => {
    beforeEach(() => {
      // 09:00 – 17:00
      fixture.componentRef.setInput('minSeconds', 9 * 3600);
      fixture.componentRef.setInput('maxSeconds', 17 * 3600);
      fixture.detectChanges();
    });

    it('disables hours that cannot hold any legal time', () => {
      const hours = columnOf(component.columns, 'hour');

      expect(optionByLabel(hours, '08').disabled).toBe(true);
      expect(optionByLabel(hours, '09').disabled).toBe(false);
      expect(optionByLabel(hours, '16').disabled).toBe(false);
      expect(optionByLabel(hours, '17').disabled).toBe(false);
      expect(optionByLabel(hours, '18').disabled).toBe(true);
    });

    it('disables minutes that would push the selected hour past max', () => {
      fixture.componentRef.setInput('hour', 17);
      fixture.detectChanges();

      const minutes = columnOf(component.columns, 'minute');
      expect(optionByLabel(minutes, '00').disabled).toBe(false);
      expect(optionByLabel(minutes, '01').disabled).toBe(true);
      expect(optionByLabel(minutes, '30').disabled).toBe(true);
    });

    it('disables minutes that would pull the selected hour before min', () => {
      fixture.componentRef.setInput('minSeconds', 9 * 3600 + 30 * 60); // 09:30
      fixture.componentRef.setInput('hour', 9);
      fixture.detectChanges();

      const minutes = columnOf(component.columns, 'minute');
      expect(optionByLabel(minutes, '00').disabled).toBe(true);
      expect(optionByLabel(minutes, '29').disabled).toBe(true);
      expect(optionByLabel(minutes, '30').disabled).toBe(false);
    });

    it('disables a whole meridiem that falls outside the window', () => {
      fixture.componentRef.setInput('use12Hours', true);
      fixture.componentRef.setInput('minSeconds', 13 * 3600); // 13:00, afternoon only
      fixture.componentRef.setInput('maxSeconds', 18 * 3600);
      fixture.detectChanges();

      const meridiem = columnOf(component.columns, 'meridiem');
      expect(optionByLabel(meridiem, 'AM').disabled).toBe(true);
      expect(optionByLabel(meridiem, 'PM').disabled).toBe(false);
    });

    it('refuses to commit a disabled entry', () => {
      const spy = jasmine.createSpy('timeChange');
      component.timeChange.subscribe(spy);

      const hours = columnOf(component.columns, 'hour');
      component.choose(hours, optionByLabel(hours, '08'), 0);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('selection', () => {
    it('marks the selected hour and minute', () => {
      fixture.componentRef.setInput('hour', 14);
      fixture.componentRef.setInput('minute', 30);
      fixture.detectChanges();

      const hours = columnOf(component.columns, 'hour');
      const minutes = columnOf(component.columns, 'minute');

      expect(component.isSelected(hours, optionByLabel(hours, '14'))).toBe(true);
      expect(component.isSelected(hours, optionByLabel(hours, '13'))).toBe(false);
      expect(component.isSelected(minutes, optionByLabel(minutes, '30'))).toBe(true);
    });

    it('emits the whole time when one column is touched', () => {
      fixture.componentRef.setInput('hour', 14);
      fixture.componentRef.setInput('minute', 30);
      fixture.detectChanges();

      const spy = jasmine.createSpy('timeChange');
      component.timeChange.subscribe(spy);

      const minutes = columnOf(component.columns, 'minute');
      component.choose(minutes, optionByLabel(minutes, '45'), 1);

      expect(spy).toHaveBeenCalledWith({ hour: 14, minute: 45, second: 0 });
    });

    it('defaults the untouched columns to zero on a first pick', () => {
      const spy = jasmine.createSpy('timeChange');
      component.timeChange.subscribe(spy);

      const hours = columnOf(component.columns, 'hour');
      component.choose(hours, optionByLabel(hours, '07'), 0);

      expect(spy).toHaveBeenCalledWith({ hour: 7, minute: 0, second: 0 });
    });

    it('renders aria-selected on the chosen entry', () => {
      fixture.componentRef.setInput('hour', 3);
      fixture.detectChanges();

      const selected = fixture.nativeElement.querySelectorAll('[role="option"][aria-selected="true"]');
      const labels = Array.from(selected).map((el) => (el as HTMLElement).textContent?.trim());
      expect(labels).toContain('03');
    });
  });

  describe('keyboard', () => {
    it('moves the active entry down and up within a column', () => {
      fixture.componentRef.setInput('hour', 5);
      fixture.detectChanges();
      expect(component.activeIndex[0]).toBe(5);

      component.onColumnKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }), 0);
      expect(component.activeIndex[0]).toBe(6);

      component.onColumnKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }), 0);
      expect(component.activeIndex[0]).toBe(5);
    });

    it('skips disabled entries while arrowing', () => {
      fixture.componentRef.setInput('minSeconds', 0);
      fixture.componentRef.setInput('maxSeconds', 7 * 3600 + 3540); // through 07:59
      fixture.componentRef.setInput('hour', 7);
      fixture.detectChanges();

      // 08 onwards is disabled, so ArrowDown from 07 finds nothing enabled.
      component.onColumnKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }), 0);
      expect(component.activeIndex[0]).toBe(7);
    });

    it('commits the active entry on Enter', () => {
      const spy = jasmine.createSpy('timeChange');
      component.timeChange.subscribe(spy);

      component.onColumnKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }), 0);
      component.onColumnKeydown(new KeyboardEvent('keydown', { key: 'Enter' }), 0);

      expect(spy).toHaveBeenCalledWith({ hour: 1, minute: 0, second: 0 });
    });

    it('moves focus between columns with ArrowLeft and ArrowRight', () => {
      fixture.detectChanges();
      const listboxes: HTMLElement[] = Array.from(
        fixture.nativeElement.querySelectorAll('[role="listbox"]')
      );
      listboxes[0].focus();

      component.onColumnKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }), 0);
      expect(document.activeElement).toBe(listboxes[1]);

      component.onColumnKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }), 1);
      expect(document.activeElement).toBe(listboxes[0]);
    });

    it('jumps to the ends with Home and End', () => {
      component.onColumnKeydown(new KeyboardEvent('keydown', { key: 'End' }), 0);
      expect(component.activeIndex[0]).toBe(23);

      component.onColumnKeydown(new KeyboardEvent('keydown', { key: 'Home' }), 0);
      expect(component.activeIndex[0]).toBe(0);
    });

    it('points aria-activedescendant at the active entry', () => {
      fixture.componentRef.setInput('hour', 5);
      fixture.detectChanges();

      const hours = columnOf(component.columns, 'hour');
      const listbox: HTMLElement = fixture.nativeElement.querySelector('[role="listbox"]');
      expect(listbox.getAttribute('aria-activedescendant')).toBe(optionByLabel(hours, '05').id);
    });
  });
});

describe('TimePickerComponent', () => {
  let component: TimePickerComponent;
  let fixture: ComponentFixture<TimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TimePickerComponent] }).compileComponents();
    fixture = TestBed.createComponent(TimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /** Opens the panel and flushes the deferred positioning work. */
  function openPanel(): TimeColumnsComponent {
    component.open();
    tick();
    fixture.detectChanges();
    tick();
    if (!component.columnsCmp) throw new Error('columns did not render');
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
    it('selects the hour and minute written to it', fakeAsync(() => {
      component.writeValue('14:30');
      fixture.detectChanges();

      expect(component.hour).toBe(14);
      expect(component.minute).toBe(30);
      expect(component.displayValue).toBe('14:30');

      const columns = openPanel();
      const hours = columnOf(columns.columns, 'hour');
      const minutes = columnOf(columns.columns, 'minute');
      expect(columns.isSelected(hours, optionByLabel(hours, '14'))).toBe(true);
      expect(columns.isSelected(minutes, optionByLabel(minutes, '30'))).toBe(true);
    }));

    it('emits an HH:mm string when a time is picked', fakeAsync(() => {
      const onChange = jasmine.createSpy('onChange');
      const valueChange = jasmine.createSpy('valueChange');
      component.registerOnChange(onChange);
      component.valueChange.subscribe(valueChange);

      const columns = openPanel();
      const hours = columnOf(columns.columns, 'hour');
      columns.choose(hours, optionByLabel(hours, '14'), 0);
      fixture.detectChanges();

      const minutes = columnOf(columns.columns, 'minute');
      columns.choose(minutes, optionByLabel(minutes, '30'), 1);

      expect(onChange).toHaveBeenCalledWith('14:30');
      expect(valueChange).toHaveBeenCalledWith('14:30');
    }));

    it('round-trips a value it emitted', fakeAsync(() => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      component.writeValue('09:45');
      fixture.detectChanges();
      const columns = openPanel();

      const minutes = columnOf(columns.columns, 'minute');
      columns.choose(minutes, optionByLabel(minutes, '15'), 1);

      expect(onChange).toHaveBeenCalledWith('09:15');
    }));

    it('emits HH:mm:ss when showSeconds is on', fakeAsync(() => {
      fixture.componentRef.setInput('showSeconds', true);
      fixture.detectChanges();

      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      component.writeValue('08:20:05');
      fixture.detectChanges();
      const columns = openPanel();

      const seconds = columnOf(columns.columns, 'second');
      columns.choose(seconds, optionByLabel(seconds, '45'), 2);

      expect(onChange).toHaveBeenCalledWith('08:20:45');
    }));

    it('ignores a malformed string', () => {
      component.writeValue('nonsense');
      expect(component.hour).toBeNull();
      expect(component.displayValue).toBe('');
    });

    it('clears the selection when written null', () => {
      component.writeValue('10:00');
      component.writeValue(null);

      expect(component.hour).toBeNull();
      expect(component.minute).toBeNull();
    });

    it('exchanges Date objects when valueType is date', fakeAsync(() => {
      fixture.componentRef.setInput('valueType', 'date');
      fixture.detectChanges();

      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      component.writeValue(new Date(2024, 4, 17, 8, 0));
      fixture.detectChanges();
      const columns = openPanel();

      const hours = columnOf(columns.columns, 'hour');
      columns.choose(hours, optionByLabel(hours, '21'), 0);

      const emitted = onChange.calls.mostRecent().args[0] as Date;
      expect(emitted instanceof Date).toBe(true);
      expect(emitted.getHours()).toBe(21);
      // The day the value arrived on must survive a time-only edit.
      expect(emitted.getFullYear()).toBe(2024);
      expect(emitted.getMonth()).toBe(4);
      expect(emitted.getDate()).toBe(17);
    }));

    it('disables the trigger through setDisabledState', () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(component.disabled).toBe(true);
      expect(trigger.disabled).toBe(true);
    });

    it('does not open while disabled', fakeAsync(() => {
      component.setDisabledState(true);
      fixture.detectChanges();

      component.open();
      tick();

      expect(component.isOpen).toBe(false);
    }));

    it('marks the control touched on close', fakeAsync(() => {
      const onTouched = jasmine.createSpy('onTouched');
      component.registerOnTouched(onTouched);
      openPanel();

      component.close();

      expect(onTouched).toHaveBeenCalled();
    }));
  });

  describe('12-hour mode', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('use12Hours', true);
      fixture.detectChanges();
    });

    it('renders midnight as 12:00 AM', () => {
      component.writeValue('00:00');
      fixture.detectChanges();
      expect(component.displayValue).toBe('12:00 AM');
    });

    it('renders noon as 12:00 PM', () => {
      component.writeValue('12:00');
      fixture.detectChanges();
      expect(component.displayValue).toBe('12:00 PM');
    });

    it('maps 12 AM to 00:00, not 12:00', fakeAsync(() => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      // Start in the afternoon so the meridiem genuinely has to change.
      component.writeValue('15:00');
      fixture.detectChanges();
      const columns = openPanel();

      const hours = columnOf(columns.columns, 'hour');
      columns.choose(hours, optionByLabel(hours, '12'), 0);
      fixture.detectChanges();
      expect(onChange).toHaveBeenCalledWith('12:00');

      const meridiem = columnOf(columns.columns, 'meridiem');
      columns.choose(meridiem, optionByLabel(meridiem, 'AM'), 2);

      expect(onChange).toHaveBeenCalledWith('00:00');
    }));

    it('maps 12 PM to 12:00, not 00:00', fakeAsync(() => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      component.writeValue('00:00');
      fixture.detectChanges();
      const columns = openPanel();

      const meridiem = columnOf(columns.columns, 'meridiem');
      columns.choose(meridiem, optionByLabel(meridiem, 'PM'), 2);

      expect(onChange).toHaveBeenCalledWith('12:00');
    }));

    it('maps an afternoon hour onto its 24-hour value', fakeAsync(() => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);

      component.writeValue('13:00');
      fixture.detectChanges();
      const columns = openPanel();

      const hours = columnOf(columns.columns, 'hour');
      columns.choose(hours, optionByLabel(hours, '09'), 0);

      expect(onChange).toHaveBeenCalledWith('21:00');
    }));

    it('selects the AM entry for a morning value', fakeAsync(() => {
      component.writeValue('07:15');
      fixture.detectChanges();
      const columns = openPanel();

      const meridiem = columnOf(columns.columns, 'meridiem');
      expect(columns.isSelected(meridiem, optionByLabel(meridiem, 'AM'))).toBe(true);
      expect(columns.isSelected(meridiem, optionByLabel(meridiem, 'PM'))).toBe(false);
    }));
  });

  describe('min and max', () => {
    it('disables entries outside the window', fakeAsync(() => {
      fixture.componentRef.setInput('min', '09:00');
      fixture.componentRef.setInput('max', '17:00');
      fixture.detectChanges();

      const columns = openPanel();
      const hours = columnOf(columns.columns, 'hour');

      expect(optionByLabel(hours, '08').disabled).toBe(true);
      expect(optionByLabel(hours, '09').disabled).toBe(false);
      expect(optionByLabel(hours, '17').disabled).toBe(false);
      expect(optionByLabel(hours, '18').disabled).toBe(true);
    }));

    it('leaves every entry enabled without bounds', fakeAsync(() => {
      const columns = openPanel();
      const hours = columnOf(columns.columns, 'hour');
      expect(hours.options.every((o) => !o.disabled)).toBe(true);
    }));

    it('ignores a malformed bound rather than disabling everything', fakeAsync(() => {
      fixture.componentRef.setInput('min', 'not-a-time');
      fixture.detectChanges();

      expect(component.minSeconds).toBe(0);
      const columns = openPanel();
      expect(columnOf(columns.columns, 'hour').options.every((o) => !o.disabled)).toBe(true);
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
      expect(component.isOpen).toBe(true);

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

    it('opens from the keyboard on ArrowDown', fakeAsync(() => {
      component.onTriggerKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      tick();

      expect(component.isOpen).toBe(true);
      component.close();
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

    it('toggles shut on a second trigger click', fakeAsync(() => {
      openPanel();
      component.toggle();
      tick();

      expect(component.isOpen).toBe(false);
    }));
  });

  it('applies the invalid styling to the trigger', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();

    expect(component.computedTriggerClass).toContain('border-destructive');
  });

  it('applies the size variant to the trigger', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    expect(component.computedTriggerClass).toContain('h-11');
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
