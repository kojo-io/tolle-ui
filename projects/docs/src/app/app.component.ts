import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContextMenuComponent } from '../../../tolle/src/lib/context-menu.component';
import {ToastContainerComponent} from '../../../tolle/src/lib/toaster.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        ContextMenuComponent,
      ToastContainerComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'docs';
}
