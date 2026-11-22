import { Component, inject } from '@angular/core';
import { ModalService } from '../../../../../../tolle/src/lib/modal.service';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';
import { UserFormComponent } from './user-form.component';

@Component({
    selector: 'app-component-modal',
    imports: [ButtonComponent],
    template: `
    <tolle-button variant="secondary" (click)="openComponentModal()">
      Open Component Modal
    </tolle-button>
  `
})
export class ComponentModalComponent {
    private modalService = inject(ModalService);

    openComponentModal() {
        const modalRef = this.modalService.open({
            title: 'Edit Profile',
            content: UserFormComponent,
            size: 'sm'
        });

        modalRef.afterClosed$.subscribe(result => {
            if (result) {
                console.log('Modal closed with result:', result);
            }
        });
    }
}
