import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TolleDatePickerComponent } from './date-picker.component';

describe('TolleDatePickerComponent', () => {
  let component: TolleDatePickerComponent;
  let fixture: ComponentFixture<TolleDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TolleDatePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TolleDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
