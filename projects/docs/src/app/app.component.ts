import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContextMenuComponent } from '../../../tolle/src/lib/context-menu.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        ContextMenuComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'docs';
}
