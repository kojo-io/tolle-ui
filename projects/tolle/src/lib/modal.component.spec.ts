import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';
import { ModalRef } from './modal-ref';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    // ModalComponent injects ModalRef and reads ref.modal.* on init.
    const modalRefStub = { modal: { content: '', size: 'default' }, close: () => {} } as unknown as ModalRef;

    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [{ provide: ModalRef, useValue: modalRefStub }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
