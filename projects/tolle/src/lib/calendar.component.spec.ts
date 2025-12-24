import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TolleCalendarComponent } from './calendar.component';

describe('TolleCalendarComponent', () => {
  let component: TolleCalendarComponent;
  let fixture: ComponentFixture<TolleCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TolleCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TolleCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
