import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGroupDocsComponent } from './button-group-docs.component';

describe('ButtonGroupDocsComponent', () => {
  let component: ButtonGroupDocsComponent;
  let fixture: ComponentFixture<ButtonGroupDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGroupDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonGroupDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
