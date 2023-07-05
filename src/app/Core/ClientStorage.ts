import { BehaviorSubject } from 'rxjs'
import { IUser } from '../Models/user.interface';

export class clientStorage {
  public static userDataEvent = new BehaviorSubject<IUser>({} as IUser);

  public static getAuthenticationToken(){
    return localStorage.getItem('token') ?? '';
  }

  public static setAuthenticationToken(token: string){
    return localStorage.setItem('token', token);
  }

  public static setUserData(user: IUser){
    window.localStorage.setItem('user', JSON.stringify(user));
    this.userDataEvent.next(user)
  }

  public static removeUserData(){
    window.localStorage.clear();
    this.userDataEvent.next({} as IUser)
  }

  public static getUserData(){
    const user = window.localStorage.getItem('user');
    if (user) {
      return JSON.parse(user) as IUser;
    }

    return null;
  }
}
