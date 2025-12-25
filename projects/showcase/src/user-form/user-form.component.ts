import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputComponent} from '../../../tolle/src/lib/input.component';
import {ButtonComponent} from '../../../tolle/src/lib/button.component';
import {ModalRef} from '../../../tolle/src/lib/modal-ref';
import {SelectComponent} from '../../../tolle/src/lib/select.component';
import {SelectGroupComponent} from '../../../tolle/src/lib/select-group.component';
import {SelectItemComponent} from '../../../tolle/src/lib/select-item.component';
import {SelectSeparatorComponent} from '../../../tolle/src/lib/select-separator.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    InputComponent,
    ReactiveFormsModule,
    ButtonComponent,
    SelectComponent,
    SelectGroupComponent,
    SelectItemComponent,
    SelectSeparatorComponent
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private ref: ModalRef // Inject the controller to close itself
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      timezone: new FormControl(''),
    });
  }

  ngOnInit() {
    // Access data passed from the parent via ref.modal.data
    if (this.ref.modal.data?.["user"]) {
      this.isEdit = true;
      this.form.patchValue(this.ref.modal.data["user"]);
    }
  }

  save() {
    if (this.form.valid) {
      // Close the modal and pass the form value back to the parent
      this.ref.close({ action: this.isEdit ? 'update' : 'create', data: this.form.value });
    }
  }

  cancel() {
    this.ref.close(); // Close without data
  }
}
