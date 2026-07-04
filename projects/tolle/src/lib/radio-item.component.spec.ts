import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioItemComponent } from './radio-item.component';
import { RadioService } from './radio-service';

describe('RadioItemComponent', () => {
  let component: RadioItemComponent;
  let fixture: ComponentFixture<RadioItemComponent>;

  beforeEach(async () => {
    // RadioService is normally provided by the parent radio-group.
    await TestBed.configureTestingModule({
      imports: [RadioItemComponent],
      providers: [RadioService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
