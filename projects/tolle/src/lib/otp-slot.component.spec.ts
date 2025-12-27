import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpSlotComponent } from './otp-slot.component';

describe('OtpSlotComponent', () => {
  let component: OtpSlotComponent;
  let fixture: ComponentFixture<OtpSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpSlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
