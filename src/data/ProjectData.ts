export interface ProjectLink {
    name: string;
    url: string;
}

export default class ProjectData {
    id: string;
    baseUrl: string;
    name: string;
    iconUrl: string; // used as thumbnail
    width: number; // Grid columns to span (1-3)
    height: number; // Grid rows to span (1-3)
    accentColor: string; // color of title bar 
    shortDescription?: string;
    fullDescription?: string;
    role?: string;
    links?: ProjectLink[];
    videos?: string[];
    images?: string[];
    preloadImages?: string[];
    hideName?: boolean;

    constructor(id: string, baseUrl: string, name: string, iconUrl: string, accentColor = "#000000", width = 1, height = 1, hideName = false) {
        this.id = id;
        this.baseUrl = baseUrl;
        this.name = name;
        this.iconUrl = iconUrl;
        this.width = Math.min(Math.max(width, 1), 3); // Ensure width is between 1 and 3
        this.height = Math.min(Math.max(height, 1), 3); // Ensure height is between 1 and 3
        this.accentColor = accentColor;
    }
}
