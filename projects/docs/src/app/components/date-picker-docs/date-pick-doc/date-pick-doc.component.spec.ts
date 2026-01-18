import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickDocComponent } from './date-pick-doc.component';

describe('DatePickDocComponent', () => {
  let component: DatePickDocComponent;
  let fixture: ComponentFixture<DatePickDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePickDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
