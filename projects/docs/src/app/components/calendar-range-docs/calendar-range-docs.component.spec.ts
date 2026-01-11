import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarRangeDocsComponent } from './calendar-range-docs.component';

describe('CalendarRangeDocsComponent', () => {
  let component: CalendarRangeDocsComponent;
  let fixture: ComponentFixture<CalendarRangeDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarRangeDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarRangeDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
