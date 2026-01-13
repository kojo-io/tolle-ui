import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckBoxDocsComponent } from './check-box-docs.component';

describe('CheckBoxDocsComponent', () => {
  let component: CheckBoxDocsComponent;
  let fixture: ComponentFixture<CheckBoxDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckBoxDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckBoxDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
