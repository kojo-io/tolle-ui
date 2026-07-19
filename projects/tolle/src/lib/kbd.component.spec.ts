import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KbdComponent, KbdGroupComponent } from './kbd.component';

@Component({
  standalone: true,
  imports: [KbdComponent, KbdGroupComponent],
  template: `
    <tolle-kbd [size]="size" [variant]="variant" [class]="extraClass">{{ text }}</tolle-kbd>

    <tolle-kbd-group>
      <tolle-kbd>Ctrl</tolle-kbd>
      <tolle-kbd>K</tolle-kbd>
    </tolle-kbd-group>
  `
})
class KbdHostComponent {
  size: any = 'default';
  variant: any = 'default';
  extraClass = '';
  text = 'K';
}

describe('KbdComponent', () => {
  let component: KbdComponent;
  let fixture: ComponentFixture<KbdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KbdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KbdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const kbd = (): HTMLElement => fixture.nativeElement.querySelector('kbd');

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a native kbd element', () => {
    expect(kbd()).toBeTruthy();
    expect(kbd().tagName.toLowerCase()).toBe('kbd');
  });

  it('applies the default size and variant classes', () => {
    expect(kbd().className).toContain('h-5');
    expect(kbd().className).toContain('bg-muted');
    expect(kbd().className).toContain('font-mono');
  });

  it('changes classes when the size variant changes', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    expect(kbd().className).toContain('h-6');
    expect(kbd().className).not.toContain('h-5');
  });

  it('applies the outline variant', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();

    expect(kbd().className).toContain('bg-transparent');
    expect(kbd().className).not.toContain('bg-muted');
  });

  it('merges extra classes passed through the class input', () => {
    fixture.componentRef.setInput('class', 'my-custom-key');
    fixture.detectChanges();

    expect(kbd().className).toContain('my-custom-key');
  });
});

describe('KbdComponent (projection)', () => {
  let hostFixture: ComponentFixture<KbdHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KbdHostComponent]
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(KbdHostComponent);
    hostFixture.detectChanges();
  });

  it('projects its content into the kbd element', () => {
    const kbd = hostFixture.nativeElement.querySelector('tolle-kbd kbd');
    expect(kbd.textContent.trim()).toBe('K');
  });

  it('reflects size changes driven from the host', () => {
    hostFixture.componentInstance.size = 'sm';
    hostFixture.detectChanges();

    const kbd = hostFixture.nativeElement.querySelector('tolle-kbd kbd');
    expect(kbd.className).toContain('h-4');
  });

  it('groups several keys inside tolle-kbd-group', () => {
    const keys = hostFixture.nativeElement.querySelectorAll('tolle-kbd-group kbd');

    expect(keys.length).toBe(2);
    expect(keys[0].textContent.trim()).toBe('Ctrl');
    expect(keys[1].textContent.trim()).toBe('K');
  });
});

describe('KbdGroupComponent', () => {
  let component: KbdGroupComponent;
  let fixture: ComponentFixture<KbdGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KbdGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KbdGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders an inline flex row', () => {
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('inline-flex');
    expect(span.className).toContain('gap-1');
  });

  it('merges extra classes passed through the class input', () => {
    fixture.componentRef.setInput('class', 'my-custom-group');
    fixture.detectChanges();

    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.className).toContain('my-custom-group');
  });
});
