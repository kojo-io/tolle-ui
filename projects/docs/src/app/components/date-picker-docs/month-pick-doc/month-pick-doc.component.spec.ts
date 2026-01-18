import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthPickDocComponent } from './month-pick-doc.component';

describe('MonthPickDocComponent', () => {
  let component: MonthPickDocComponent;
  let fixture: ComponentFixture<MonthPickDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthPickDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthPickDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
