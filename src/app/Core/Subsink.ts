import { Subscription} from 'rxjs'

export class SubSink{
  private allSubscription: Subscription[] = [];

  set sink(sub: any){
    this.allSubscription.push(sub);

  }

  unSubscribe(){
    this.allSubscription.forEach(sub => sub.unsubscribe());
  }
}
