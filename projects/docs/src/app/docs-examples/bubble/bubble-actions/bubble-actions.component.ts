import { Component } from '@angular/core';
import {
    BubbleComponent,
    BubbleActionsComponent,
    BubbleReactionsComponent,
    BubbleReaction
} from '../../../../../../tolle/src/lib/bubble.component';

@Component({
    selector: 'app-bubble-actions',
    standalone: true,
    imports: [BubbleComponent, BubbleActionsComponent, BubbleReactionsComponent],
    templateUrl: './bubble-actions.component.html'
})
export class BubbleActionsExampleComponent {
    copied = false;
    lastReaction = '';

    reactions: BubbleReaction[] = [
        { emoji: '👍', count: 3, reacted: true },
        { emoji: '🎉', count: 1 },
        { emoji: '👀', count: 2 }
    ];

    copy(): void {
        this.copied = true;
        setTimeout(() => (this.copied = false), 1200);
    }

    toggle(reaction: BubbleReaction): void {
        this.lastReaction = reaction.emoji;
        reaction.reacted = !reaction.reacted;
        reaction.count = (reaction.count ?? 0) + (reaction.reacted ? 1 : -1);
    }
}
