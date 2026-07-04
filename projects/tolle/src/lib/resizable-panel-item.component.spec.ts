import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizablePanelItemComponent } from './resizable-panel-item.component';
import { ResizablePanelComponent } from './resizable-panel.component';

describe('ResizablePanelItemComponent', () => {
  let component: ResizablePanelItemComponent;
  let fixture: ComponentFixture<ResizablePanelItemComponent>;

  beforeEach(async () => {
    // The item injects its parent ResizablePanelComponent (direction + startResize).
    const parentStub = { direction: 'horizontal', startResize: () => {} } as unknown as ResizablePanelComponent;

    await TestBed.configureTestingModule({
      imports: [ResizablePanelItemComponent],
      providers: [{ provide: ResizablePanelComponent, useValue: parentStub }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResizablePanelItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
