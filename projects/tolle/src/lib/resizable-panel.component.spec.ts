import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizablePanelComponent } from './resizable-panel.component';

describe('ResizablePanelComponent', () => {
  let component: ResizablePanelComponent;
  let fixture: ComponentFixture<ResizablePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizablePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResizablePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
