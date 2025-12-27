import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpGroupComponent } from './otp-group.component';

describe('OtpGroupComponent', () => {
  let component: OtpGroupComponent;
  let fixture: ComponentFixture<OtpGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
