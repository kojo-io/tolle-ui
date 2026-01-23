export interface PropEntry {
    name: string;
    type: string;
    default?: string;
    description: string;
}

export interface ComponentMetadata {
    name: string;
    selectors: string[];
    inputs: PropEntry[];
    outputs: PropEntry[];
    slots?: { name: string; description: string }[];
}
