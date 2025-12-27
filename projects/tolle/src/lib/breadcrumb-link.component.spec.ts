import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbLinkComponent } from './breadcrumb-link.component';

describe('BreadcrumbLinkComponent', () => {
  let component: BreadcrumbLinkComponent;
  let fixture: ComponentFixture<BreadcrumbLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreadcrumbLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
