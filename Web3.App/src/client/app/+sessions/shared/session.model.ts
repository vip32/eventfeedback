export class Session {
    id: number;
    eventId: number;
    name: string;

    constructor(id: number, eventId: number, name: string) {
        this.id = id;
        this.eventId = eventId;
        this.name = name;
    }
}