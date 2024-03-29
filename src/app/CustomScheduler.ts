//import { AsyncAction } from './AsyncAction';
//import { AsyncScheduler } from './AsyncScheduler';

import { AsyncAction } from 'rxjs/scheduler/AsyncAction';
import { AsyncScheduler } from 'rxjs/scheduler/AsyncScheduler';
import { AsapAction } from 'rxjs/scheduler/AsapAction';

export class CustomScheduler extends AsyncScheduler {
  public flush(action?: AsyncAction<any>): void {

    this.active = true;
    this.scheduled = undefined;

    const {actions} = this;
    let error: any;
    let index: number = -1;
    let count: number = actions.length;
    action = action || actions.shift();

    do {
      if (error = action.execute(action.state, action.delay)) {
        console.log('what what');
        //break;
      }
    } while (++index < count && (action = actions.shift()));

    this.active = false;

    if (error) {
      while (++index < count && (action = actions.shift())) {
        action.unsubscribe();
      }
      throw error;
    }
  }
}

export const customScheduler = new CustomScheduler(AsapAction);
