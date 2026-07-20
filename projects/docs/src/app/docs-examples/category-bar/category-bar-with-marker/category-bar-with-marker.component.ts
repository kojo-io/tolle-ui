import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryBarComponent } from '../../../../../../tolle/src/lib/category-bar.component';

@Component({
    selector: 'app-category-bar-with-marker',
    standalone: true,
    imports: [CommonModule, CategoryBarComponent],
    styles: [':host { display: block; width: 100%; }'],
    templateUrl: './category-bar-with-marker.component.html'
})
export class CategoryBarWithMarkerComponent {
    values = [20, 20, 20, 20, 20];
    labels = ['Poor', 'Fair', 'Good', 'Very good', 'Exceptional'];
    score = 720;
    // The scale runs 300-850; the marker input is 0-100, so map the score into it.
    markerValue = ((this.score - 300) / (850 - 300)) * 100;
}
