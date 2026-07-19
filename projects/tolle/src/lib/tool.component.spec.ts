import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  ToolComponent,
  ToolHeaderComponent,
  ToolInputComponent,
  ToolOutputComponent,
  ToolState,
} from './tool.component';

@Component({
  standalone: true,
  imports: [ToolComponent, ToolHeaderComponent, ToolInputComponent, ToolOutputComponent],
  template: `
    <tolle-tool [state]="state" [open]="open" (openChange)="openEvents.push($event)">
      <tolle-tool-header name="get_weather"></tolle-tool-header>
      <tolle-tool-input [payload]="input"></tolle-tool-input>
      <tolle-tool-output [payload]="output"></tolle-tool-output>
    </tolle-tool>
  `,
})
class HostComponent {
  state: ToolState = 'pending';
  open = false;
  input: unknown = { city: 'Accra' };
  output: unknown = 'Sunny, 31°C';
  openEvents: boolean[] = [];
}

describe('ToolComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  const header = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('[data-tool-header]');

  const chip = (): HTMLElement => fixture.nativeElement.querySelector('[data-tool-state]');

  const input = (): HTMLElement | null => fixture.nativeElement.querySelector('[data-tool-input]');

  const output = (): HTMLElement | null =>
    fixture.nativeElement.querySelector('[data-tool-output]');

  const setState = (state: ToolState) => {
    fixture.componentInstance.state = state;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('shows the tool name in the header', () => {
    expect(fixture.nativeElement.querySelector('[data-tool-name]').textContent.trim()).toBe(
      'get_weather'
    );
  });

  it('renders a muted chip while pending', () => {
    expect(chip().textContent!.trim()).toBe('Pending');
    expect(chip().className).toContain('text-muted-foreground');
  });

  it('renders a running chip with a spinner', () => {
    setState('running');

    expect(chip().textContent!.trim()).toBe('Running');
    expect(chip().className).toContain('text-info');
    expect(chip().querySelector('i')!.className).toContain('animate-spin');
  });

  it('renders a success chip once the call completes', () => {
    setState('success');

    expect(chip().textContent!.trim()).toBe('Completed');
    expect(chip().className).toContain('text-success');
  });

  it('renders a destructive chip when the call fails', () => {
    setState('error');

    expect(chip().textContent!.trim()).toBe('Error');
    expect(chip().className).toContain('text-destructive');
  });

  it('keeps the payloads collapsed until the header is pressed', () => {
    expect(input()).toBeNull();
    expect(output()).toBeNull();
    expect(header().getAttribute('aria-expanded')).toBe('false');

    header().click();
    fixture.detectChanges();

    expect(input()).toBeTruthy();
    expect(output()).toBeTruthy();
    expect(header().getAttribute('aria-expanded')).toBe('true');
    expect(fixture.componentInstance.openEvents).toEqual([true]);

    header().click();
    fixture.detectChanges();

    expect(input()).toBeNull();
    expect(fixture.componentInstance.openEvents).toEqual([true, false]);
  });

  it('pretty-prints an object payload as JSON in a scrollable block', () => {
    header().click();
    fixture.detectChanges();

    const pre = input()!.querySelector('pre')!;
    expect(pre.textContent).toBe('{\n  "city": "Accra"\n}');
    expect(pre.className).toContain('overflow-x-auto');
    expect(pre.className).toContain('bg-muted');
  });

  it('renders a string payload verbatim', () => {
    header().click();
    fixture.detectChanges();

    expect(output()!.querySelector('pre')!.textContent).toBe('Sunny, 31°C');
  });

  it('labels each payload block', () => {
    header().click();
    fixture.detectChanges();

    expect(input()!.textContent).toContain('Parameters');
    expect(output()!.textContent).toContain('Result');
  });

  it('opens from the open input', () => {
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    expect(input()).toBeTruthy();
    expect(fixture.componentInstance.openEvents).toEqual([]);
  });
});
