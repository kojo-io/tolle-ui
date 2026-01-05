import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionDocsComponent } from './accordion-docs.component';

describe('AccordionComponent', () => {
  let component: AccordionDocsComponent;
  let fixture: ComponentFixture<AccordionDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccordionDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
