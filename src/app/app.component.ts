import { Component } from '@angular/core';
import { Observable, Subject, Scheduler } from 'rxjs';
import { customScheduler } from './CustomScheduler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Observable test output: ';
  output: string;
  constructor() {
    this.output = '';

    try {
      this.registerDifferentBus();
    } catch(err) {
      this.output += "~~~~~~~~~~~~\n";
      this.output += err.toString();
      this.output += "\n~~~~~~~~~~~~\n";
    }

    try {
      setTimeout(() => {
        try {
          this.output += "======================= USING CUSTOM SCHEDULER ================================\n";
          this.useCustomScheduler();
        } catch(err) {
          this.output += "~~~~~~~~~~~~\n";
          this.output += err.toString();
          this.output += "\n~~~~~~~~~~~~\n";
        }
      }, 3000);
    } catch(err) {
      this.output += "error error error" + err;
    }
  }

  registerDifferentBus() {

    let messageBus = new Subject();

    let obs = messageBus
      .map((event: any) => { return event.data; })
      .share();

    obs.subscribe((v) => {
      this.output += "1st subscriber: " + v + '\n';
      console.log("1st subscriber: " + v);
    }, (err) => console.log('wat an ', err));

    obs.subscribe(v => {
      if (v === '2nd event') {
        throw new Error('CUSTOM EXCEPTION THROWN');
      }
      this.output += "2nd subscriber: " + v + '\n';
      console.log("2nd subscriber: " + v);
    });

    // this subscriber is never hit after the 2nd event error is thrown above
    obs.subscribe(v => {
      this.output += "3rd subscriber: " + v + '\n'
      console.log("3rd subscriber: " + v);
    }, (err) => console.log('a new', err));

    messageBus.next({ data: '1st event' });

    messageBus.next({ data: '2nd event' });

    messageBus.next({ data: 'lost event' });

    setTimeout(() => {
      messageBus.next({data: '3rd event'});
    }, 1000);

  }

  useCustomScheduler() {

    let messageBus = new Subject();

    let obs = messageBus
      .map((event: any) => { return event.data; })
      .share()
      .observeOn(customScheduler);

    obs.subscribe((v) => {
      this.output += "1st subscriber: " + v + '\n';
      console.log("1st subscriber: " + v);
    }, (err) => console.log('wat an ', err));

    obs.subscribe(v => {
      if (v === '2nd event') {
        throw new Error('CUSTOM EXCEPTION THROWN');
      }
      this.output += "2nd subscriber: " + v + '\n';
      console.log("2nd subscriber: " + v);
    });

    // this subscriber is never hit after the 2nd event error is thrown above
    obs.subscribe(v => {
      this.output += "3rd subscriber: " + v + '\n'
      console.log("3rd subscriber: " + v);
    }, (err) => console.log('a new', err));

    messageBus.next({ data: '1st event' });

    messageBus.next({ data: '2nd event' });

    messageBus.next({ data: 'lost event' });

    setTimeout(() => {
      messageBus.next({data: '3rd event'});
      this.output += ""
    }, 1000);

  }
}
