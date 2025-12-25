import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSeparatorComponent } from './dropdown-separator.component';

describe('DropdownSeparatorComponent', () => {
  let component: DropdownSeparatorComponent;
  let fixture: ComponentFixture<DropdownSeparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownSeparatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownSeparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
