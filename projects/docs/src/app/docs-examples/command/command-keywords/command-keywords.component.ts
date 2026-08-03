import { Component } from '@angular/core';

import {
  CommandComponent,
  CommandInputComponent,
  CommandListComponent,
  CommandEmptyComponent,
  CommandGroupComponent,
  CommandItemComponent,
} from '../../../../../../tolle/src/lib/command.component';

@Component({
  selector: 'app-command-keywords',
  imports: [
    CommandComponent,
    CommandInputComponent,
    CommandListComponent,
    CommandEmptyComponent,
    CommandGroupComponent,
    CommandItemComponent,
  ],
  templateUrl: './command-keywords.component.html',
})
export class CommandKeywordsComponent {
  billingKeywords = ['invoice', 'payment', 'receipt'];
  membersKeywords = ['team', 'people', 'seats'];
}
