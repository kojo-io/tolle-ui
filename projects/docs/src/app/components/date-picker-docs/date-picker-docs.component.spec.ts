import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerDocsComponent } from './date-picker-docs.component';

describe('DatePickerDocsComponent', () => {
  let component: DatePickerDocsComponent;
  let fixture: ComponentFixture<DatePickerDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePickerDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
