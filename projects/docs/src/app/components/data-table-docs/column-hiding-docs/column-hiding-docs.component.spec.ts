import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnHidingDocsComponent } from './column-hiding-docs.component';

describe('ColumnHidingDocsComponent', () => {
  let component: ColumnHidingDocsComponent;
  let fixture: ComponentFixture<ColumnHidingDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnHidingDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnHidingDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
