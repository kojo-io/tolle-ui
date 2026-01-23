import { Component } from '@angular/core';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../../shared/types';

@Component({
    selector: 'app-avatar-api',
    standalone: true,
    imports: [PropTableComponent],
    templateUrl: './avatar-api.component.html'
})
export class AvatarApiComponent {
    avatarProps: PropEntry[] = [
        { name: 'src', type: 'string', description: 'The source URL of the avatar image.' },
        { name: 'alt', type: 'string', default: "''", description: 'Alternative text for the avatar image.' },
        { name: 'size', type: "'sm' | 'default' | 'lg' | 'xl'", default: "'default'", description: 'The size of the avatar.' },
        { name: 'shape', type: "'circle' | 'square'", default: "'circle'", description: 'The shape of the avatar.' }
    ];

    fallbackProps: PropEntry[] = [
        { name: 'class', type: 'string', description: 'Additional CSS classes for the fallback container.' }
    ];
}
