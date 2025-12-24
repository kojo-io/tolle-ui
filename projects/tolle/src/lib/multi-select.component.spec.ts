import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TolleMultiSelectComponent } from './multi-select.component';

describe('TolleMultiSelectComponent', () => {
  let component: TolleMultiSelectComponent;
  let fixture: ComponentFixture<TolleMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TolleMultiSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TolleMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
