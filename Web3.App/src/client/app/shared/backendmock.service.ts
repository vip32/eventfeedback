import {Injectable} from '@angular/core';
import {Event, Session, Feedback} from './backend.service';

@Injectable()
export class BackendMockService {

  getEvents(): Event[] {
    console.log('load events');
    return [
      new Event({ id: 100, title: 'Event 1', description: 'Event 1a' }),
      new Event({ id: 200, title: 'Event 2', description: 'Event 2b' }),
      new Event({ id: 300, title: 'Event 3', description: 'Event 3c' }),
    ];
  }

  getSessions(event: Event): Session[] {
    console.log('load sessions for event ' + event.id);
    return [
      new Session({ id: event.id + 10, eventId: event.id, title: 'Session 1 - ' + event.title }),
      new Session({ id: event.id + 20, eventId: event.id, title: 'Session 2 - ' + event.title }),
      new Session({ id: event.id + 30, eventId: event.id, title: 'Session 3 - ' + event.title }),
      new Session({ id: event.id + 40, eventId: event.id, title: 'Session 4 - ' + event.title }),
      new Session({ id: event.id + 50, eventId: event.id, title: 'Session 5 - ' + event.title }),
      new Session({ id: event.id + 60, eventId: event.id, title: 'Session 6 - ' + event.title }),
    ];
  }

  getFeedbacks(): Feedback[] {
    console.log('load user feedbacks');
    return [
      new Feedback({ id: 1001, eventId: 100, sessionId: 110, answer0: 'q1111111qqq' }),
      new Feedback({ id: 2001, eventId: 200, sessionId: 210, answer0: 'q1111qqq' }),
      new Feedback({ id: 3001, eventId: 300, sessionId: 310, answer0: 'q11qqq' })
    ];
  }

  getFeedback(session: Session) {
    console.log('load feedback for session ' + session.id);
    let result: Feedback;
    let feedbacks = this.getFeedbacks();
    if (feedbacks) {
      result = feedbacks.find(f => f.sessionId === session.id);
    }
    if (!result) {
      console.log('ensure feedback ', session.id);
      result = new Feedback({ id: this.getRandomNumber(2000, 9000), eventId: session.eventId, sessionId: session.id });
    }
    return result;
  }

  getRandomNumber(min: number = 1000, max: number = 9000): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

// export class Feedback {
//     id: number;
//     eventid: number;
//     sessionId: number;
//     q1: string;
//     q2: string;
//     q3: string;
//     q4: string;
//     q5: string;
//     q6: string;
//     constructor(id: number, eventId: number, sessionId: number,
//                 q1?:string,
//                 q2?:string,
//                 q3?:string,
//                 q4?:string,
//                 q5?:string,
//                 q6?:string) {
//         this.id = id;
//         this.eventid = eventId;
//         this.sessionId = sessionId;
//         this.q1 = q1;
//         this.q2 = q2;
//         this.q3 = q3;
//         this.q4 = q4;
//         this.q5 = q5;
//         this.q6 = q6;
//     }
// }

// export class Event {
//     id: number;
//     name: string;
//     description: string;
//     q1: string;
//     q2: string;
//     q3: string;
//     q4: string;
//     q5: string;
//     q6: string;

//     constructor(id: number, name: string, description: string) {
//         this.id = id;
//         this.name = name;
//         this.description = description;
//         this.q1 = '';
//         this.q2 = '';
//         this.q3 = '';
//         this.q4 = '';
//         this.q5 = '';
//         this.q6 = '';
//     }
// }

// export class Session {
//     id: number;
//     eventId: number;
//     name: string;

//     constructor(id: number, eventId: number, name: string) {
//         this.id = id;
//         this.eventId = eventId;
//         this.name = name;
//     }
// }