import { Component } from '@angular/core';
import {ButtonComponent} from '../../../../tolle/src/lib/button.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './components.component.html',
  styleUrl: './components.component.css'
})
export class ComponentsComponent {

}
