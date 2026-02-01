import { Component } from '@angular/core';
import { DataTableComponent, TableColumn } from '../../../../../../tolle/src/lib/data-table.component';

@Component({
    selector: 'app-sticky',
    standalone: true,
    imports: [
        DataTableComponent
    ],
    templateUrl: './sticky.component.html'
})
export class StickyComponent {
    columns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'role', label: 'Role', sortable: true },
        { key: 'status', label: 'Status' }
    ];

    users = [
        { id: 1, name: 'Alex Rivera', email: 'alex@example.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Jordan Smith', email: 'jordan@example.com', role: 'User', status: 'Inactive' },
        { id: 3, name: 'Taylor Johnson', email: 'taylor.johnson@example.com', role: 'Editor', status: 'Active' },
        { id: 4, name: 'Morgan Lee', email: 'morgan.lee@example.com', role: 'User', status: 'Active' },
        { id: 5, name: 'Casey Brown', email: 'casey.brown@example.com', role: 'User', status: 'Pending' },
        { id: 6, name: 'Riley Anderson', email: 'riley.anderson@example.com', role: 'Admin', status: 'Active' },
        { id: 7, name: 'Jamie Clark', email: 'jamie.clark@example.com', role: 'User', status: 'Active' },
        { id: 8, name: 'Avery Martinez', email: 'avery.martinez@example.com', role: 'User', status: 'Inactive' },
        { id: 9, name: 'Quinn Walker', email: 'quinn.walker@example.com', role: 'Editor', status: 'Active' },
        { id: 10, name: 'Drew Thompson', email: 'drew.thompson@example.com', role: 'User', status: 'Suspended' },
        { id: 11, name: 'Parker Lewis', email: 'parker.lewis@example.com', role: 'User', status: 'Active' },
        { id: 12, name: 'Rowan Harris', email: 'rowan.harris@example.com', role: 'Admin', status: 'Active' },
        { id: 13, name: 'Logan White', email: 'logan.white@example.com', role: 'User', status: 'Pending' },
        { id: 14, name: 'Skyler Hall', email: 'skyler.hall@example.com', role: 'Editor', status: 'Active' },
        { id: 15, name: 'Reese Young', email: 'reese.young@example.com', role: 'User', status: 'Active' },
        { id: 16, name: 'Cameron King', email: 'cameron.king@example.com', role: 'User', status: 'Inactive' },
        { id: 17, name: 'Emerson Wright', email: 'emerson.wright@example.com', role: 'Admin', status: 'Active' },
        { id: 18, name: 'Harper Lopez', email: 'harper.lopez@example.com', role: 'User', status: 'Active' },
        { id: 19, name: 'Finley Scott', email: 'finley.scott@example.com', role: 'Editor', status: 'Active' },
        { id: 20, name: 'Dakota Green', email: 'dakota.green@example.com', role: 'User', status: 'Pending' }
    ];
}
