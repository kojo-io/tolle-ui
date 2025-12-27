import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AspectRatioComponent } from './aspect-ratio.component';

describe('AspectRatioComponent', () => {
  let component: AspectRatioComponent;
  let fixture: ComponentFixture<AspectRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AspectRatioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AspectRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
