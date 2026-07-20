import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { ModalComponent } from './modal.component';
import { ModalRef } from './modal-ref';
import { Modal } from './modal';

function createModalRefStub(modal: Modal, closing$ = new BehaviorSubject(false)) {
  return { modal, closing$, close: () => {} } as unknown as ModalRef;
}

async function setup(modal: Modal, closing$?: BehaviorSubject<boolean>) {
  const modalRefStub = createModalRefStub(modal, closing$);

  await TestBed.configureTestingModule({
    imports: [ModalComponent],
    providers: [{ provide: ModalRef, useValue: modalRefStub }]
  }).compileComponents();

  const fixture = TestBed.createComponent(ModalComponent);
  fixture.detectChanges();
  return { fixture, modalRefStub };
}

describe('ModalComponent', () => {
  let fixture: ComponentFixture<ModalComponent>;

  const panel = (): HTMLElement => fixture.nativeElement.querySelector('[role="dialog"]');
  const closeButton = (): HTMLElement | null => fixture.nativeElement.querySelector('button[aria-label="Close"]');
  const header = (): HTMLElement | null => fixture.nativeElement.querySelector('h2');

  it('should create', async () => {
    ({ fixture } = await setup({ content: '', size: 'default' }));
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the close button when showCloseButton is true, independent of a title', async () => {
    ({ fixture } = await setup({ content: '', size: 'default', showCloseButton: true }));
    expect(closeButton()).toBeTruthy();
    expect(header()).toBeNull();
  });

  it('hides the close button when showCloseButton is false', async () => {
    ({ fixture } = await setup({ content: '', size: 'default', showCloseButton: false }));
    expect(closeButton()).toBeNull();
  });

  it('renders the title header separately from the close button', async () => {
    ({ fixture } = await setup({ content: '', size: 'default', title: 'Edit profile', showCloseButton: true }));
    expect(header()!.textContent).toContain('Edit profile');
    expect(closeButton()).toBeTruthy();
  });

  it('marks the panel data-state open on creation and closed once the ref starts closing', async () => {
    const closing$ = new BehaviorSubject(false);
    ({ fixture } = await setup({ content: '', size: 'default' }, closing$));

    expect(panel().getAttribute('data-state')).toBe('open');

    closing$.next(true);
    fixture.detectChanges();

    expect(panel().getAttribute('data-state')).toBe('closed');
  });
});
