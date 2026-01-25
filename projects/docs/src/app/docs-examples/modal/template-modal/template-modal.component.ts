import { Component, inject, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../../../../../tolle/src/lib/modal.service';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
  selector: 'app-template-modal',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <tolle-button variant="outline" (click)="openTemplateModal(modalTemp)">
      Open Template Modal
    </tolle-button>

    <ng-template #modalTemp let-message="message">
      <div class="space-y-4">
        <p class="text-foreground">{{ message }}</p>
        <div class="flex justify-end pt-4">
          <tolle-button size="sm" (click)="close()">Got it!</tolle-button>
        </div>
      </div>
    </ng-template>
  `
})
export class TemplateModalComponent {
  private modalService = inject(ModalService);
  private modalRef: any;

  openTemplateModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.open({
      title: 'Template Modal',
      content: template,
      size: 'default',
      context: { message: 'This content is rendered from an <ng-template> with dynamic context!' }
    });
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
