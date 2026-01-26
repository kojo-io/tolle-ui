import { Project, SyntaxKind, ClassDeclaration, PropertyDeclaration, GetAccessorDeclaration, Node } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';

const project = new Project({
    tsConfigFilePath: path.join(__dirname, '../tsconfig.app.json'),
});

const componentsDir = path.join(__dirname, '../src/app/components');

interface DocContent {
    name: string;
    selector?: string;
    installation?: string;
    description?: string;
    examples: { [key: string]: string };
    props: { [key: string]: any[] };
}

function extractFromClass(clazz: ClassDeclaration): DocContent {
    const name = clazz.getName() || 'Unknown';
    const content: DocContent = {
        name,
        examples: {},
        props: {}
    };

    // Extract selector from decorator
    const componentDecorator = clazz.getDecorator('Component');
    if (componentDecorator) {
        const args = componentDecorator.getArguments();
        const obj = args.length > 0 ? args[0].asKind(SyntaxKind.ObjectLiteralExpression) : undefined;
        if (obj) {
            const selectorProp = obj.getProperty('selector');
            if (selectorProp && Node.isPropertyAssignment(selectorProp)) {
                content.selector = selectorProp.getInitializer()?.getText().replace(/['"]/g, '');
            }
        }
    }

    // Extract properties
    clazz.getProperties().forEach((prop: PropertyDeclaration) => {
        const propName = prop.getName();
        const initializer = prop.getInitializer();

        if (!initializer) return;

        const isSnippet = propName.endsWith('Code') ||
            propName === 'installation' ||
            propName === 'globalStyles' ||
            propName === 'tailwindConfig' ||
            propName.includes('Usage');

        if (propName === 'installation') {
            content.installation = initializer.getText().replace(/^[`'"]/, '').replace(/[`'"]$/, '');
        }

        if (isSnippet) {
            content.examples[propName] = initializer.getText().replace(/^[`'"]/, '').replace(/[`'"]$/, '');
        }

        if (propName.endsWith('Props') && initializer.asKind(SyntaxKind.ArrayLiteralExpression)) {
            content.props[propName] = evalProps(initializer.getText());
        }
    });

    // Extract getters (like playgroundCode)
    clazz.getGetAccessors().forEach((getter: GetAccessorDeclaration) => {
        const getterName = getter.getName();
        if (getterName.endsWith('Code')) {
            const returnStatement = getter.getFirstDescendantByKind(SyntaxKind.ReturnStatement);
            if (returnStatement) {
                const expression = returnStatement.getExpression();
                if (expression) {
                    content.examples[getterName] = expression.getText().replace(/^[`'"]/, '').replace(/[`'"]$/, '');
                }
            }
        }
    });

    return content;
}

function evalProps(text: string): any[] {
    try {
        // Clean up the text to be valid JS array if possible
        // Remove trailing commas and other TS-isms if present
        let cleanText = text.trim();
        // If it looks like an array literal, we can try to parse it
        // For LLM context, even the raw text is often enough, but let's try to get objects
        const fn = new Function(`return ${cleanText}`);
        return fn();
    } catch (e) {
        return [{ error: 'Could not parse props statically', raw: text }];
    }
}

const allContent: { [key: string]: DocContent[] } = {};

const sourceFiles = project.getSourceFiles(path.join(componentsDir, '**/*.ts'));

sourceFiles.forEach(sf => {
    const classes = sf.getClasses();
    if (classes.length > 0) {
        const relPath = path.relative(componentsDir, sf.getFilePath());
        const componentName = relPath.split('/')[0];

        if (!allContent[componentName]) {
            allContent[componentName] = [];
        }

        classes.forEach(clazz => {
            const extracted = extractFromClass(clazz);
            // Only add if it has some meat
            if (extracted.installation || Object.keys(extracted.examples).length > 0 || Object.keys(extracted.props).length > 0) {
                allContent[componentName].push(extracted);
            }
        });
    }
});

// Post-process to merge components in the same directory
const mergedContent: { [key: string]: any } = {};

for (const key in allContent) {
    const components = allContent[key];
    if (components.length === 0) continue;

    // Usually the main docs component is just [Key]DocsComponent
    mergedContent[key] = {
        category: key,
        components: components
    };
}

const outputPath = path.join(__dirname, '../src/assets/docs-content.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(mergedContent, null, 2));

console.log(`Extracted documentation content to ${outputPath}`);
