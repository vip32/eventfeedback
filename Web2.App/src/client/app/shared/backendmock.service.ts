import {Injectable} from '@angular/core';
import {Event, Session, Feedback} from './backend.service';

@Injectable()
export class BackendMockService {

  getEvents(): Event[] {
    console.log('load events');
    return [
      new Event({ id: 100, title: 'Event 1', location: 'Amsterdam', description: 'Event 1a Magna commodo eiusmod minim deserunt irure reprehenderit deserunt laborum tempor tempor culpa cillum.' }),
      new Event({ id: 200, title: 'Event 2', location: 'Stuttgart', description: 'Event 2b Magna commodo eiusmod minim deserunt irure reprehenderit deserunt laborum tempor tempor culpa cillum.' }),
      new Event({ id: 300, title: 'Event 3', location: 'Amsterdam', description: 'Event 3c Magna commodo eiusmod minim deserunt irure reprehenderit deserunt laborum tempor tempor culpa cillum.' }),
    ];
  }

  getSessions(eventId: number): Session[] {
    console.log('load sessions for event ' + eventId);
    return [
      new Session({
        id: eventId + 10, eventId: eventId, title: 'Session 1', speakers: ["Speaker X"], 
        location: 'Room X', description: 'Magna commodo eiusmod minim deserunt irure reprehenderit deserunt laborum tempor tempor culpa cillum.'
      }),
      new Session({
        id: eventId + 20, eventId: eventId, title: 'Session 2', speakers: ["Speaker X"], 
        location: 'Room X', description: 'Magna commodo eiusmod minim deserunt irure reprehenderit deserunt laborum tempor tempor culpa cillum.'
      }),
      new Session({
        id: eventId + 30, eventId: eventId, title: 'Session 3', speakers: ["Speaker X"], 
        location: 'Room X', description: 'Magna commodo eiusmod minim deserunt irure reprehenderit deserunt laborum tempor tempor culpa cillum.'
      }),
      new Session({
        id: eventId + 40, eventId: eventId, title: 'Session 4', speakers: ["Speaker X"], 
        location: 'Room X', description: 'Magna commodo eiusmod minim deserunt irure reprehenderit deserunt laborum tempor tempor culpa cillum.'
      }),
      new Session({
        id: eventId + 50, eventId: eventId, title: 'Session 5', speakers: ["Speaker X"], 
        location: 'Room X', description: 'Magna commodo eiusmod minim deserunt irure reprehenderit deserunt laborum tempor tempor culpa cillum.'
      }),
      new Session({
        id: eventId + 60, eventId: eventId, title: 'Session 6', speakers: ["Speaker X"], 
        location: 'Room X', description: 'Magna commodo eiusmod minim deserunt irure reprehenderit deserunt laborum tempor tempor culpa cillum.'
      }),
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
