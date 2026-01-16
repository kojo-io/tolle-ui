import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationDocsComponent } from './pagination-docs.component';

describe('PaginationDocsComponent', () => {
  let component: PaginationDocsComponent;
  let fixture: ComponentFixture<PaginationDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
