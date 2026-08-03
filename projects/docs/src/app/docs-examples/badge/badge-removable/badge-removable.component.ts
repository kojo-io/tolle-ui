import { Component } from '@angular/core';
import { BadgeComponent } from '../../../../../../tolle/src/lib/badge.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-badge-removable',
    imports: [BadgeComponent, CommonModule],
    templateUrl: './badge-removable.component.html'
})
export class BadgeRemovableComponent {
    badges = [
        { id: 1, label: 'Design' },
        { id: 2, label: 'Verified' }
    ];

    remove(id: number) {
        this.badges = this.badges.filter(b => b.id !== id);
    }
}
