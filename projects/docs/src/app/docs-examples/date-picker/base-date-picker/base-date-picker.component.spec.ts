import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDatePickerComponent } from './base-date-picker.component';

describe('BaseDatePickerComponent', () => {
  let component: BaseDatePickerComponent;
  let fixture: ComponentFixture<BaseDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseDatePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
