import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShimmerComponent, type ShimmerProps } from './shimmer.component';

@Component({
  standalone: true,
  imports: [ShimmerComponent],
  template: `<tolle-shimmer [active]="active" [size]="size">{{ text }}</tolle-shimmer>`,
})
class ShimmerHostComponent {
  @Input() active = true;
  @Input() size: ShimmerProps['size'] = 'default';
  @Input() text = 'Thinking…';
}

describe('ShimmerComponent', () => {
  let component: ShimmerComponent;
  let fixture: ComponentFixture<ShimmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ShimmerComponent] }).compileComponents();

    fixture = TestBed.createComponent(ShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const label = (): HTMLElement => fixture.nativeElement.querySelector('span');

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('applies the shimmer utility class while active', () => {
    expect(label().className).toContain('shimmer');
    expect(label().getAttribute('data-active')).toBe('');
  });

  it('announces itself politely while active', () => {
    expect(label().getAttribute('role')).toBe('status');
    expect(label().getAttribute('aria-live')).toBe('polite');
  });

  it('renders plain static text when inactive', () => {
    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();

    expect(label().className).not.toContain('shimmer');
    expect(label().className).toContain('text-muted-foreground');
    expect(label().getAttribute('data-active')).toBeNull();
  });

  it('drops the live region when inactive so settled text is not re-announced', () => {
    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();

    expect(label().getAttribute('role')).toBeNull();
    expect(label().getAttribute('aria-live')).toBeNull();
  });

  it('uses the default text size', () => {
    expect(label().className).toContain('text-base');
  });

  it('supports the xs size variant', () => {
    fixture.componentRef.setInput('size', 'xs');
    fixture.detectChanges();

    expect(label().className).toContain('text-xs');
    expect(label().className).not.toContain('text-base');
  });

  it('supports the sm size variant', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    expect(label().className).toContain('text-sm');
  });

  it('supports the lg and xl size variants', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(label().className).toContain('text-lg');

    fixture.componentRef.setInput('size', 'xl');
    fixture.detectChanges();
    expect(label().className).toContain('text-xl');
  });

  it('merges extra classes onto the label', () => {
    fixture.componentRef.setInput('class', 'my-shimmer');
    fixture.detectChanges();

    expect(label().className).toContain('my-shimmer');
  });
});

describe('ShimmerComponent projection', () => {
  let hostFixture: ComponentFixture<ShimmerHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ShimmerHostComponent] }).compileComponents();

    hostFixture = TestBed.createComponent(ShimmerHostComponent);
    hostFixture.detectChanges();
  });

  it('projects the status text', () => {
    expect(hostFixture.nativeElement.textContent).toContain('Thinking…');
  });

  it('keeps the same text mounted when the shimmer stops', () => {
    hostFixture.componentRef.setInput('active', false);
    hostFixture.detectChanges();

    const label: HTMLElement = hostFixture.nativeElement.querySelector('tolle-shimmer span');
    expect(label.textContent).toContain('Thinking…');
    expect(label.className).not.toContain('shimmer');
  });
});
