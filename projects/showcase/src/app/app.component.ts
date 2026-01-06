import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet} from '@angular/router';
import {ToastContainerComponent} from '../../../tolle/src/lib/toaster.component';
import {ThemeService} from '../../../tolle/src/lib/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastContainerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  theme = inject(ThemeService)
  ngOnInit(): void {

  }
  title = 'showcase';
}
