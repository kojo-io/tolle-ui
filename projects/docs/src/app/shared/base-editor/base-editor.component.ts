import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Input, OnChanges, inject,
  Output, SimpleChanges, ViewChild,
} from '@angular/core';
import { BaseService } from '../base.service';
import { FormsModule } from '@angular/forms';
import { EditorState, Compartment } from '@codemirror/state'; // Import Compartment
import { basicSetup, EditorView } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';

// Languages
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { StreamLanguage } from '@codemirror/language'; // Required for Bash
import { shell } from '@codemirror/legacy-modes/mode/shell';

// Define a type for the supported languages
export type EditorLanguage = 'javascript' | 'typescript' | 'html' | 'css' | 'bash' | 'json' | 'angular';

@Component({
  selector: 'app-base-editor',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './base-editor.component.html',
  // Ensure the host has height so the editor can fill it
  styles: [`
    :host { display: block; height: 100%; width: 100%; }
    .w-full { height: 100%; }
  `]
})
export class BaseEditorComponent implements AfterViewInit, OnChanges {

  @ViewChild('editor', { static: true })
  editorRef!: ElementRef<HTMLDivElement>;

  @Input() code: string = '';
  @Input() language: EditorLanguage = 'javascript'; // New Input
  @Output() codeChange = new EventEmitter<string>();

  private baseService = inject(BaseService);
  private view?: EditorView;

  // A Compartment allows us to dynamically reconfigure a specific part of the editor (the language)
  private languageCompartment = new Compartment();

  ngAfterViewInit() {
    this.initEditor();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.view) return;

    // Handle Code Changes
    if (changes['code']) {
      this.updateEditorContent(changes['code'].currentValue ?? '');
    }

    // Handle Language Changes
    if (changes['language']) {
      this.view.dispatch({
        effects: this.languageCompartment.reconfigure(this.getLanguageExtension())
      });
    }
  }

  private initEditor() {
    // 1. Define the custom theme for bg-neutral-900 (#171717)
    const customBackground = EditorView.theme({
      "&": {
        backgroundColor: "#171717", // bg-neutral-900
        color: "#d4d4d4"            // text-neutral-300 (readable text)
      },
      ".cm-gutters": {
        backgroundColor: "#171717", // Match the main background
        color: "#525252",           // text-neutral-600 (subtle line numbers)
        border: "none"              // Remove the border between gutter and code
      },
      ".cm-activeLineGutter": {
        backgroundColor: "transparent",
        color: "#ffffff"            // White line number for active line
      },
      ".cm-activeLine": {
        backgroundColor: "#26262650" // bg-neutral-800 with opacity (subtle highlight)
      }
    }, { dark: true });

    const state = EditorState.create({
      doc: this.code ?? '',
      extensions: [
        basicSetup,
        customBackground,
        oneDark,
        // Use the compartment to wrap the initial language
        this.languageCompartment.of(this.getLanguageExtension()),
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
        EditorView.theme({
          "&": { height: "100%" },
          ".cm-scroller": { overflow: "auto" }
        }),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            this.codeChange.emit(update.state.doc.toString());
          }
        })
      ]
    });

    this.view = new EditorView({
      state,
      parent: this.editorRef.nativeElement
    });
  }

  private updateEditorContent(newCode: string) {
    const currentDoc = this.view!.state.doc.toString();
    if (currentDoc === newCode) return;

    this.view!.dispatch({
      changes: {
        from: 0,
        to: this.view!.state.doc.length,
        insert: newCode
      }
    });
  }

  // Helper to switch extensions based on the input string
  private getLanguageExtension() {
    switch (this.language) {
      case 'typescript':
        return javascript({ typescript: true });
      case 'html':
      case 'angular':
        return html();
      case 'css':
        return css();
      case 'bash':
        // Bash uses the StreamLanguage adapter with legacy shell mode
        return StreamLanguage.define(shell);
      case 'json':
        return json();
      default:
        return javascript();
    }
  }

  copyCode() {
    this.baseService.copyTo(this.code);
  }
}
