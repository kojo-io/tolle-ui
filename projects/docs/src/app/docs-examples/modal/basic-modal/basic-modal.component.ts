import { Component, inject } from '@angular/core';
import { ModalService } from '../../../../../../tolle/src/lib/modal.service';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-basic-modal',
    standalone: true,
    imports: [ButtonComponent],
    template: `
    <tolle-button (click)="openModal()">Open Simple Modal</tolle-button>
  `
})
export class BasicModalComponent {
    private modalService = inject(ModalService);

    openModal() {
        this.modalService.open({
            title: 'Simple Modal',
            backdropClose: true,
            size: 'default',
            showCloseButton: true,
            content: 'This is a basic modal with string content. It is useful for simple alerts or notifications.'
        });
    }
}
