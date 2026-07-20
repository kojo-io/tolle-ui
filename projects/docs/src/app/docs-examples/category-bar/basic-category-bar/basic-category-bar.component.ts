import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryBarComponent } from '../../../../../../tolle/src/lib/category-bar.component';

@Component({
    selector: 'app-basic-category-bar',
    standalone: true,
    imports: [CommonModule, CategoryBarComponent],
    styles: [':host { display: block; width: 100%; }'],
    templateUrl: './basic-category-bar.component.html'
})
export class BasicCategoryBarComponent {
    values = [15, 35, 35, 15];
    labels = ['Poor', 'Fair', 'Good', 'Excellent'];
}
