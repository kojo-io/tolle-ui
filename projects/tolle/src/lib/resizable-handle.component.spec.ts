import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableHandleComponent } from './resizable-handle.component';

describe('ResizableHandleComponent', () => {
  let component: ResizableHandleComponent;
  let fixture: ComponentFixture<ResizableHandleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizableHandleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResizableHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
