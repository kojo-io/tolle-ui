import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizablePanelGroupComponent } from './resizable-panel-group.component';

describe('ResizablePanelGroupComponent', () => {
  let component: ResizablePanelGroupComponent;
  let fixture: ComponentFixture<ResizablePanelGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizablePanelGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResizablePanelGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
