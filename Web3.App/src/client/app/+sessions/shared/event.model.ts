export class Event {
    id: number;
    name: string;
    description: string;
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
    q6: string;

    constructor(id: number, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.q1 = '';
        this.q2 = '';
        this.q3 = '';
        this.q4 = '';
        this.q5 = '';
        this.q6 = '';
    }
}