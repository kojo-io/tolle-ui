import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbDocsComponent } from './breadcrumb-docs.component';

describe('BreadcrumbDocsComponent', () => {
  let component: BreadcrumbDocsComponent;
  let fixture: ComponentFixture<BreadcrumbDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreadcrumbDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
