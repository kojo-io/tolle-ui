import {Component, inject, OnInit} from '@angular/core';
import {BaseEditorComponent} from "../../shared/base-editor/base-editor.component";
import {NgIf} from "@angular/common";
import {SegmentedComponent} from "../../../../../tolle/src/lib/segment.component";
import {BaseService} from '../../shared/base.service';
import {FormsModule} from '@angular/forms';
import {BadgeComponent} from '../../../../../tolle/src/lib/badge.component';
import {AccordionComponent} from '../../../../../tolle/src/lib/accordion.component';
import {AccordionItemComponent} from '../../../../../tolle/src/lib/accordion-item.component';
import {AnalyticsService} from '../../../../../showcase/src/app/analytics.service';

@Component({
  selector: 'app-badge-docs',
  standalone: true,
  imports: [
    BaseEditorComponent,
    NgIf,
    SegmentedComponent,
    FormsModule,
    BadgeComponent,
    AccordionComponent,
    AccordionItemComponent
  ],
  templateUrl: './badge-docs.component.html',
  styleUrl: './badge-docs.component.css'
})
export class BadgeDocsComponent implements OnInit {
  baseService = inject(BaseService);
  analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.init();
  }

  selectedTab = "preview";
  singleUsage = "preview";

  viewOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' }
  ];

  installation = "import {BadgeComponent} from '@tolle_/tolle-ui';\n" +
    "\n" +
    "\n" +
    "imports: [\n" +
    "    BadgeComponent,\n" +
    "  ]";

  badgeComponent = "<div class=\"py-4\">\n" +
    "  <div class=\"flex flex-wrap gap-4 items-center\">\n" +
    "    <tolle-badge>Active</tolle-badge>\n" +
    "    <tolle-badge variant=\"secondary\">Draft</tolle-badge>\n" +
    "    <tolle-badge variant=\"outline\">Archived</tolle-badge>\n" +
    "    <tolle-badge variant=\"destructive\">Error</tolle-badge>\n" +
    "    <tolle-badge size=\"xs\">XS Tag</tolle-badge>\n" +
    "    <tolle-badge size=\"sm\">SM Tag</tolle-badge>\n" +
    "    <tolle-badge size=\"default\">Default Tag</tolle-badge>\n" +
    "  </div>\n" +
    "  <div class=\"flex items-center gap-2 mt-2\">\n" +
    "    <span class=\"text-sm font-medium block\">Notifications</span>\n" +
    "    <tolle-badge variant=\"destructive\" size=\"xs\" class=\"rounded-full\">99+</tolle-badge>\n" +
    "  </div>\n" +
    "  <div class=\"flex flex-wrap gap-2 mt-2\">\n" +
    "    <tolle-badge variant=\"secondary\">\n" +
    "      <i prefix class=\"ri-price-tag-3-line\"></i>\n" +
    "      Ecommerce\n" +
    "    </tolle-badge>\n" +
    "\n" +
    "    <tolle-badge\n" +
    "      variant=\"outline\"\n" +
    "      [removable]=\"true\">\n" +
    "      Design\n" +
    "    </tolle-badge>\n" +
    "\n" +
    "    <tolle-badge [removable]=\"true\">\n" +
    "      Verified\n" +
    "    </tolle-badge>\n" +
    "  </div>\n" +
    "</div>";
}
