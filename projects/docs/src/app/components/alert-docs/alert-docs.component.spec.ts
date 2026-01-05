import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDocsComponent } from './alert-docs.component';

describe('AlertDocsComponent', () => {
  let component: AlertDocsComponent;
  let fixture: ComponentFixture<AlertDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
