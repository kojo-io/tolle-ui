import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnHidingComponent } from './column-hiding.component';

describe('ColumnHidingComponent', () => {
  let component: ColumnHidingComponent;
  let fixture: ComponentFixture<ColumnHidingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnHidingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnHidingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
