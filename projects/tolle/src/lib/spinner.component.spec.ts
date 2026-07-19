import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const status = (): HTMLElement =>
    fixture.nativeElement.querySelector('[role="status"]');

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a status role so screen readers announce the loading state', () => {
    expect(status()).toBeTruthy();
  });

  it('defaults the accessible label to "Loading"', () => {
    expect(status().getAttribute('aria-label')).toBe('Loading');
    expect(fixture.nativeElement.querySelector('.sr-only').textContent.trim()).toBe('Loading');
  });

  it('reflects a custom label in both aria-label and the sr-only text', () => {
    fixture.componentRef.setInput('label', 'Saving changes');
    fixture.detectChanges();

    expect(status().getAttribute('aria-label')).toBe('Saving changes');
    expect(fixture.nativeElement.querySelector('.sr-only').textContent.trim()).toBe('Saving changes');
  });

  it('applies the animation and shape base classes', () => {
    expect(status().className).toContain('animate-spin');
    expect(status().className).toContain('rounded-full');
  });

  it('applies the default size classes', () => {
    expect(status().className).toContain('h-5');
    expect(status().className).toContain('w-5');
  });

  it('changes classes when the size variant changes', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    expect(status().className).toContain('h-8');
    expect(status().className).toContain('w-8');
    expect(status().className).not.toContain('h-5');
  });

  it('supports the xs and xl size variants', () => {
    fixture.componentRef.setInput('size', 'xs');
    fixture.detectChanges();
    expect(status().className).toContain('h-3');

    fixture.componentRef.setInput('size', 'xl');
    fixture.detectChanges();
    expect(status().className).toContain('h-12');
  });

  it('applies the colour variant classes', () => {
    fixture.componentRef.setInput('variant', 'destructive');
    fixture.detectChanges();

    expect(status().className).toContain('text-destructive');
  });

  it('merges extra classes passed through the class input', () => {
    fixture.componentRef.setInput('class', 'my-custom-spinner');
    fixture.detectChanges();

    expect(status().className).toContain('my-custom-spinner');
  });
});
