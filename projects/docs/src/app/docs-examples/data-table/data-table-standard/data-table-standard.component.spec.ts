import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableStandardComponent } from './data-table-standard.component';

describe('DataTableStandardComponent', () => {
  let component: DataTableStandardComponent;
  let fixture: ComponentFixture<DataTableStandardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableStandardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
