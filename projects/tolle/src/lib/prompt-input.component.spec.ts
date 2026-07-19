import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  PromptInputComponent,
  PromptInputStatus,
  PromptInputSubmitComponent,
  PromptInputToolbarComponent,
  PromptInputToolsComponent,
} from './prompt-input.component';

@Component({
  standalone: true,
  imports: [
    PromptInputComponent,
    PromptInputToolbarComponent,
    PromptInputToolsComponent,
    PromptInputSubmitComponent,
  ],
  template: `
    <tolle-prompt-input
      [status]="status"
      [submitOnEnter]="submitOnEnter"
      (submitted)="submissions.push($event)"
      (stopped)="stops = stops + 1"
    >
      <tolle-prompt-input-toolbar>
        <tolle-prompt-input-tools>
          <button type="button">attach</button>
        </tolle-prompt-input-tools>
        <tolle-prompt-input-submit></tolle-prompt-input-submit>
      </tolle-prompt-input-toolbar>
    </tolle-prompt-input>
  `,
})
class HostComponent {
  status: PromptInputStatus = 'ready';
  submitOnEnter = true;
  submissions: string[] = [];
  stops = 0;
}

describe('PromptInputComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  const textarea = (): HTMLTextAreaElement =>
    fixture.nativeElement.querySelector('[data-prompt-input-textarea]');

  const submitButton = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('[data-prompt-input-submit]');

  const type = (text: string) => {
    const el = textarea();
    el.value = text;
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  const pressEnter = (options: KeyboardEventInit = {}) => {
    textarea().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ...options }));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('submits the trimmed text on Enter', () => {
    type('  hello world  ');
    pressEnter();

    expect(fixture.componentInstance.submissions).toEqual(['hello world']);
  });

  it('clears the composer after submitting', () => {
    type('hello');
    pressEnter();

    expect(textarea().value).toBe('');
  });

  it('does not submit on Shift+Enter', () => {
    type('hello');
    pressEnter({ shiftKey: true });

    expect(fixture.componentInstance.submissions).toEqual([]);
    expect(textarea().value).toBe('hello');
  });

  it('does not submit an empty or whitespace-only message', () => {
    type('   ');
    pressEnter();

    expect(fixture.componentInstance.submissions).toEqual([]);
  });

  it('leaves Enter alone when submitOnEnter is false', () => {
    fixture.componentInstance.submitOnEnter = false;
    fixture.detectChanges();

    type('hello');
    pressEnter();

    expect(fixture.componentInstance.submissions).toEqual([]);
  });

  it('round-trips its value through the ControlValueAccessor contract', () => {
    const standalone = TestBed.createComponent(PromptInputComponent);
    standalone.detectChanges();

    const control = standalone.componentInstance;
    const el: HTMLTextAreaElement = standalone.nativeElement.querySelector(
      '[data-prompt-input-textarea]'
    );

    control.writeValue('from the form');
    standalone.detectChanges();
    expect(el.value).toBe('from the form');
    expect(control.value).toBe('from the form');

    let seen = '';
    control.registerOnChange((value: string) => (seen = value));

    el.value = 'typed by the user';
    el.dispatchEvent(new Event('input'));
    standalone.detectChanges();

    expect(seen).toBe('typed by the user');

    let touched = false;
    control.registerOnTouched(() => (touched = true));
    el.dispatchEvent(new Event('blur'));
    expect(touched).toBe(true);
  });

  it('disables its submit button until there is something to send', () => {
    expect(submitButton().disabled).toBe(true);

    type('hello');
    expect(submitButton().disabled).toBe(false);
  });

  it('submits when the submit button is pressed', () => {
    type('hello');
    submitButton().click();
    fixture.detectChanges();

    expect(fixture.componentInstance.submissions).toEqual(['hello']);
  });

  it('flips the submit button to a stop button while streaming', () => {
    type('hello');
    expect(submitButton().getAttribute('aria-label')).toBe('Send message');
    expect(submitButton().getAttribute('data-state')).toBe('ready');

    fixture.componentInstance.status = 'streaming';
    fixture.detectChanges();

    expect(submitButton().getAttribute('aria-label')).toBe('Stop generating');
    expect(submitButton().getAttribute('data-state')).toBe('streaming');
    // Stopping stays available even with an empty composer.
    expect(submitButton().disabled).toBe(false);
  });

  it('emits stopped instead of submitted while streaming', () => {
    type('hello');
    fixture.componentInstance.status = 'streaming';
    fixture.detectChanges();

    submitButton().click();
    fixture.detectChanges();

    expect(fixture.componentInstance.stops).toBe(1);
    expect(fixture.componentInstance.submissions).toEqual([]);
  });

  it('ignores Enter while a response is streaming', () => {
    type('hello');
    fixture.componentInstance.status = 'streaming';
    fixture.detectChanges();

    pressEnter();

    expect(fixture.componentInstance.submissions).toEqual([]);
  });

  it('reflects the error status on the textarea', () => {
    fixture.componentInstance.status = 'error';
    fixture.detectChanges();

    expect(textarea().getAttribute('aria-invalid')).toBe('true');
  });
});
