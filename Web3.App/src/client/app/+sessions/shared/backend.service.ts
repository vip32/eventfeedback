import {Injectable} from '@angular/core';
import {Event} from './event.model';
import {Session} from './session.model';
import {Feedback} from './feedback.model';

@Injectable()
export class BackendService {

  getEvents(): Event[] {
    console.log('load events');
    return [
      new Event(100, 'Event 1', 'Event 1a'),
      new Event(200, 'Event 2', 'Event 2b'),
      new Event(300, 'Event 3', 'Event 3c'),
    ];
  }

  getSessions(event: Event): Session[] {
    console.log('load sessions for event ' + event.id);
    return [
      new Session(event.id + 10, event.id, 'Session 1 - ' + event.name),
      new Session(event.id + 20, event.id, 'Session 2 - ' + event.name),
      new Session(event.id + 30, event.id, 'Session 3 - ' + event.name),
      new Session(event.id + 40, event.id, 'Session 4 - ' + event.name),
      new Session(event.id + 50, event.id, 'Session 5 - ' + event.name),
      new Session(event.id + 60, event.id, 'Session 6 - ' + event.name)
    ];
  }

  getFeedbacks(): Feedback[] {
    console.log('load user feedbacks');
    return [
      new Feedback(1001, 100, 110, 'q1111111qqq'),
      new Feedback(2001, 200, 210, 'q1111qqq'),
      new Feedback(3001, 300, 310, 'q11qqq')
    ];
  }

  getFeedback(session: Session) {
    console.log('load feedback for session ' + session.id);
    let result: Feedback;
    let feedbacks = this.getFeedbacks();
    if (feedbacks) {
      result = feedbacks.find(f => f.sessionId === session.id);
    }
    if(!result) {
      console.log('ensure feedback ', session.id);
      result = new Feedback(this.getRandomNumber(2000,9000), session.eventId, session.id);
    }
    return result;
  }

  getRandomNumber(min: number = 1000, max: number = 9000):number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
