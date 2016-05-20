export class Feedback {
    id: number;
    eventid: number;
    sessionId: number;
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
    q6: string;
    constructor(id: number, eventId: number, sessionId: number,
                q1?:string,
                q2?:string,
                q3?:string,
                q4?:string,
                q5?:string,
                q6?:string) {
        this.id = id;
        this.eventid = eventId;
        this.sessionId = sessionId;
        this.q1 = q1;
        this.q2 = q2;
        this.q3 = q3;
        this.q4 = q4;
        this.q5 = q5;
        this.q6 = q6;
    }
}