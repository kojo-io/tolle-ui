import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeCalendarComponent } from './range-calendar.component';

describe('RangeCalendarComponent', () => {
  let component: RangeCalendarComponent;
  let fixture: ComponentFixture<RangeCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangeCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /** The month and year buttons in a panel header, left to right. */
  function headerButtons(panel = 0): HTMLButtonElement[] {
    const headers = fixture.nativeElement.querySelectorAll('.flex.items-center.gap-1');
    return Array.from(headers[panel]?.querySelectorAll('button') ?? []);
  }

  describe('month / year quick pickers', () => {
    it('opens the month picker from the header in the single-month view', () => {
      component.viewDate = new Date(2024, 4, 10); // May 2024
      component.generateDays();
      fixture.detectChanges();

      headerButtons()[0].click();
      fixture.detectChanges();

      expect(component.currentView).toBe('month');
      component.selectMonth(8); // Sep
      fixture.detectChanges();

      expect(component.currentView).toBe('date');
      expect(component.viewDate.getMonth()).toBe(8);
    });

    it('opens the pickers from either panel header in the two-month view', () => {
      fixture.componentRef.setInput('numberOfMonths', 2);
      component.viewDate = new Date(2024, 4, 10); // panels: May, Jun 2024
      component.generateDays();
      fixture.detectChanges();

      // Second panel's month button — the case that previously did nothing.
      headerButtons(1)[0].click();
      fixture.detectChanges();

      expect(component.currentView).toBe('month');
      expect(component.pickerMonthIndex).toBe(1);
      expect(component.pickerDate.getMonth()).toBe(5); // picker edits Jun
    });

    it('re-anchors so the clicked panel lands on the chosen month', () => {
      fixture.componentRef.setInput('numberOfMonths', 2);
      component.viewDate = new Date(2024, 0, 31); // panels: Jan, Feb 2024
      component.generateDays();
      fixture.detectChanges();

      component.setView('month', 1); // edit the right-hand panel
      component.selectMonth(8); // Sep
      fixture.detectChanges();

      // Right-hand panel is Sep, so the view starts at Aug.
      expect(component.viewDate.getMonth()).toBe(7);
      expect(component.visibleMonths.map(m => m.date.getMonth())).toEqual([7, 8]);
      expect(component.pickerMonthIndex).toBe(0);
      expect(component.currentView).toBe('date');
    });

    it('re-anchors on a year picked from the right-hand panel', () => {
      fixture.componentRef.setInput('numberOfMonths', 2);
      component.viewDate = new Date(2024, 11, 1); // panels: Dec 2024, Jan 2025
      component.generateDays();
      fixture.detectChanges();

      component.setView('year', 1); // picker edits Jan 2025
      expect(component.pickerDate.getFullYear()).toBe(2025);

      component.selectYear(2030);
      fixture.detectChanges();

      // Right-hand panel is Jan 2030, so the view starts at Dec 2029.
      expect(component.viewDate.getFullYear()).toBe(2029);
      expect(component.viewDate.getMonth()).toBe(11);
      expect(component.currentView).toBe('date');
    });

    it('shows one picker for the whole calendar, not one per panel', () => {
      fixture.componentRef.setInput('numberOfMonths', 2);
      component.generateDays();
      component.setView('month', 1);
      fixture.detectChanges();

      const grids = fixture.nativeElement.querySelectorAll('.grid.grid-cols-3');
      expect(grids.length).toBe(1);
      // The day grids give way to the picker, as in the single-month view.
      expect(fixture.nativeElement.querySelectorAll('[role="grid"]').length).toBe(0);
    });
  });
});
