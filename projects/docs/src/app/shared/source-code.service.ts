// source-code.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SourceCodeService {

    // Base path matching the 'output' from angular.json
    private basePath = '/source-code';

    constructor(private http: HttpClient) { }

    getFile(path: string): Observable<string> {
        // responseType: 'text' is CRITICAL here.
        return this.http.get(`${this.basePath}/${path}`, {
            responseType: 'text'
        }).pipe(
            // Transform the content before it reaches the component
            map(content => this.transformImports(content)),
            catchError(err => {
                console.error('Could not load source file:', path, err);
                return of('// Error: Source code not found.');
            })
        );
    }

    /**
     * Rewrites local '../../tolle/src/lib/...' imports to '@tolle_/tolle-ui'
     */
    private transformImports(content: string): string {
        const targetPathMatch = 'tolle/src/lib';
        const newLibraryName = '@tolle_/tolle-ui';
        const collectedMembers = new Set<string>();

        // Regex to find imports targeting the library path
        // Captures: 1. The members inside { }, 2. The path
        const regex = new RegExp(`import\\s+\\{([^}]+)\\}\\s+from\\s+['"]([^'"]*${targetPathMatch}[^'"]*)['"];?(\\r?\\n)?`, 'g');

        // 1. Remove matching lines and collect class names
        let newContent = content.replace(regex, (match, members) => {
            // Split "DataTableComponent, TableColumn" and clean whitespace
            members.split(',').forEach((m: string) => collectedMembers.add(m.trim()));
            // Return empty string to delete the line
            return '';
        });

        // 2. If we extracted any members, inject the new import statement
        if (collectedMembers.size > 0) {
            const mergedMembers = Array.from(collectedMembers).join(', ');
            const newImportLine = `import { ${mergedMembers} } from '${newLibraryName}';\n`;

            // Find the last existing import to place ours after it
            const lastImportIndex = newContent.lastIndexOf('import ');

            if (lastImportIndex > -1) {
                // Find the end of that specific line
                const endOfLineIndex = newContent.indexOf('\n', lastImportIndex);
                newContent =
                    newContent.slice(0, endOfLineIndex + 1) +
                    newImportLine +
                    newContent.slice(endOfLineIndex + 1);
            } else {
                // Fallback: Add to the very top if no other imports exist
                newContent = newImportLine + newContent;
            }
        }

        return newContent;
    }
}
