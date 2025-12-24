import { Component } from '@angular/core';
import {UserFormComponent} from '../user-form/user-form.component';
import {ModalService} from '../../../tolle/src/lib/modal.service';
import {Modal} from '../../../tolle/src/lib/modal';
import {DataTableComponent, TableColumn} from '../../../tolle/src/lib/data-table.component';
import {TolleCellDirective} from '../../../tolle/src/lib/tolle-cell.directive';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    DataTableComponent,
    TolleCellDirective
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users = [
    { id: 1, name: 'Alex Rivera', email: 'alex@example.com' },
    { id: 2, name: 'Jordan Smith', email: 'jordan@example.com' }
  ];

  columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'actions', label: 'Actions', class: 'text-right w-[100px]' }
  ];

  constructor(private modalService: ModalService) {}

  addUser() {
    // 1. Configure the Modal
    const config = new Modal();
    config.content = UserFormComponent;
    config.title = 'Add New User';
    config.size = 'default'; // ~544px

    // 2. Open it
    const ref = this.modalService.open(config);

    // 3. Handle the result when closed
    ref.afterClosed$.subscribe(result => {
      if (result?.action === 'create') {
        this.users = [...this.users, { id: Date.now(), ...result.data }];
        // In a real app, you'd call an API here
      }
    });
  }

  editUser(user: any) {
    const config = new Modal();
    config.content = UserFormComponent;
    config.title = 'Edit User';
    config.size = 'default';
    config.data = { user }; // Pass the user data to the form

    const ref = this.modalService.open(config);

    ref.afterClosed$.subscribe(result => {
      if (result?.action === 'update') {
        this.users = this.users.map(u => u.id === user.id ? { ...u, ...result.data } : u);
      }
    });
  }
}
