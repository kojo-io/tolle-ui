import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerComponent, MarkerGroupComponent } from './marker.component';

@Component({
  standalone: true,
  imports: [MarkerComponent, MarkerGroupComponent],
  template: `
    <tolle-marker-group>
      <tolle-marker variant="status" [shimmer]="true">Thinking…</tolle-marker>
      <tolle-marker variant="default" icon="ri-tools-line">Ran a tool</tolle-marker>
    </tolle-marker-group>
  `
})
class MarkerHostComponent {}

describe('MarkerComponent', () => {
  let component: MarkerComponent;
  let fixture: ComponentFixture<MarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const row = (): HTMLElement => fixture.nativeElement.querySelector('div');
  const label = (): HTMLElement => row().querySelector('span:not([aria-hidden])')!;
  const rules = (): HTMLElement[] =>
    Array.from(row().querySelectorAll('span[aria-hidden]'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('centres system notes by default', () => {
    expect(row().className).toContain('justify-center');
    expect(row().className).toContain('text-muted-foreground');
    expect(row().getAttribute('role')).toBeNull();
  });

  it('applies the error variant classes and announces politely', () => {
    fixture.componentRef.setInput('variant', 'error');
    fixture.detectChanges();

    expect(row().className).toContain('text-destructive');
    expect(row().className).toContain('font-medium');
    expect(row().getAttribute('role')).toBe('status');
    expect(row().getAttribute('aria-live')).toBe('polite');
  });

  it('applies the status variant classes and announces politely', () => {
    fixture.componentRef.setInput('variant', 'status');
    fixture.detectChanges();

    expect(row().className).toContain('justify-start');
    expect(row().getAttribute('role')).toBe('status');
    expect(row().getAttribute('aria-live')).toBe('polite');
  });

  it('renders a rule either side of a separator label', () => {
    fixture.componentRef.setInput('variant', 'separator');
    fixture.componentRef.setInput('label', 'Yesterday');
    fixture.detectChanges();

    expect(row().getAttribute('role')).toBe('separator');
    expect(rules().length).toBe(2);
    expect(rules().every(r => r.className.includes('bg-border'))).toBe(true);
    expect(label().textContent!.trim()).toBe('Yesterday');
  });

  it('renders no rules for non-separator variants', () => {
    fixture.componentRef.setInput('label', 'System note');
    fixture.detectChanges();

    expect(rules().length).toBe(0);
    expect(label().textContent!.trim()).toBe('System note');
  });

  it('does not apply the shimmer utility unless asked', () => {
    fixture.componentRef.setInput('label', 'Thinking…');
    fixture.detectChanges();

    expect(label().className).not.toContain('shimmer');
  });

  it('applies the shimmer utility when the shimmer input is set', () => {
    fixture.componentRef.setInput('label', 'Thinking…');
    fixture.componentRef.setInput('shimmer', true);
    fixture.detectChanges();

    expect(label().className).toContain('shimmer');
  });

  it('renders a leading icon when one is given', () => {
    fixture.componentRef.setInput('icon', 'ri-tools-line');
    fixture.detectChanges();

    const icon: HTMLElement = row().querySelector('i')!;
    expect(icon.className).toContain('ri-tools-line');
    expect(icon.className).toContain('shrink-0');
  });

  it('pulses the icon alongside a shimmering label', () => {
    fixture.componentRef.setInput('icon', 'ri-loader-4-line');
    fixture.componentRef.setInput('shimmer', true);
    fixture.detectChanges();

    expect(row().querySelector('i')!.className).toContain('animate-pulse');
  });

  it('merges extra classes passed through the class input', () => {
    fixture.componentRef.setInput('class', 'my-custom-marker');
    fixture.detectChanges();

    expect(row().className).toContain('my-custom-marker');
  });
});

describe('MarkerGroupComponent', () => {
  let hostFixture: ComponentFixture<MarkerHostComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkerHostComponent]
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(MarkerHostComponent);
    hostFixture.detectChanges();
    host = hostFixture.nativeElement;
  });

  it('stacks its markers in a column', () => {
    const group: HTMLElement = host.querySelector('tolle-marker-group div')!;

    expect(group.className).toContain('flex-col');
    expect(group.getAttribute('role')).toBe('group');
  });

  it('projects each marker with its own variant', () => {
    const markers = host.querySelectorAll('tolle-marker');

    expect(markers.length).toBe(2);
    expect(markers[0].querySelector('div')!.className).toContain('justify-start');
    expect(markers[1].querySelector('div')!.className).toContain('justify-center');
  });

  it('projects marker content alongside the label input', () => {
    const first: HTMLElement = host.querySelector('tolle-marker')!;
    expect(first.textContent!.trim()).toBe('Thinking…');
  });
});
