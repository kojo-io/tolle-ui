import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchableComponent } from './searchable.component';

describe('SearchableComponent', () => {
  let component: SearchableComponent;
  let fixture: ComponentFixture<SearchableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
