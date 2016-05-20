/**
 * Event
 */
export class Event {
    id: number;
    name: string;
    description: string;
    icon: string;
    constructor(id: number, name: string, description: string, icon: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
    }
}