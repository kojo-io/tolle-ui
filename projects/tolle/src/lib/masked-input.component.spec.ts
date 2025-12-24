import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TolleMaskedInputComponent } from './masked-input.component';

describe('TolleMaskedInputComponent', () => {
  let component: TolleMaskedInputComponent;
  let fixture: ComponentFixture<TolleMaskedInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TolleMaskedInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TolleMaskedInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
