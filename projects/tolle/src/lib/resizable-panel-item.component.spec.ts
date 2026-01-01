import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizablePanelItemComponent } from './resizable-panel-item.component';

describe('ResizablePanelItemComponent', () => {
  let component: ResizablePanelItemComponent;
  let fixture: ComponentFixture<ResizablePanelItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizablePanelItemComponent]
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
