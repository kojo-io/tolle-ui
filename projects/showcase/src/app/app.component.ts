import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {ToastContainerComponent} from '../../../tolle/src/lib/toaster.component';
import {ResizablePanelItemComponent} from '../../../tolle/src/lib/resizable-panel-item.component';
import {ResizableComponent} from '../../../tolle/src/lib/resizable.component';
import {ResizablePanelComponent} from '../../../tolle/src/lib/resizable-panel.component';
import {ThemeService} from '../../../tolle/src/lib/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastContainerComponent,
    ResizablePanelItemComponent,
    ResizableComponent,
    ResizablePanelComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  theme = inject(ThemeService)
  ngOnInit(): void {

  }
  title = 'showcase';

  onResize(event: any) {
    console.log(event);
  }
}
