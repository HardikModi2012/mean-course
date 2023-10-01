import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';

import {environment} from 'src/environments/environment';

/**
 * API Service to call every type of api
 *
 * @export
 * @class ApiService
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  /**
   * Creates an instance of ApiService.
   * @param {HttpClient} http
   * @memberof ApiService
   */
  constructor(private http: HttpClient) {}

  /**
   * Calls Get Api to server with API URL From Environment
   *
   * @param {string} path
   * @param {*} params
   * @return {*}
   * @memberof ApiService
   */
  get(path: string, params: any): Observable<any> {
    return this.http.get(`${environment.API_URL}${path}`, {params});
  }

  /**
   * Calls Get Api to server with API URL From Environment
   *
   * @param {string} path
   * @param {*} params
   * @return {*}
   * @memberof ApiService
   */
  getText(path: string, params: any): Observable<any> {
    return this.http.get(`${environment.API_URL}${path}`, {params, responseType: 'text'});
  }

  /**
   * Calls Get Api to server with API URL From Environment
   *
   * @param {string} path
   * @param {*} params
   * @return {*}
   * @memberof ApiService
   */
  getResponseText(path: string, params: any): Observable<any> {
    return this.http.get(`${environment.API_URL}${path}`, {params, responseType: 'text'});
  }

  /**
   * Calls Get Api to server with API URL From Environment
   *
   * @param {string} path
   * @param {*} params
   * @return {*}
   * @memberof ApiService
   */
  getArrayBuffer(path: string, params: any): Observable<any> {
    return this.http.get(`${environment.API_URL}${path}`, {params, responseType: 'arraybuffer'});
  }

  /**
   * Calls Post Api to server with API URL From Environment
   *
   * @param {string} path
   * @param {*} body
   * @return {*}
   * @memberof ApiService
   */
  post(path: string, body: any): Observable<any> {
    return this.http.post(`${environment.API_URL}${path}`, body);
  }

  /**
   * Calls Post Api to server with API URL From Environment
   *
   * @param {string} path
   * @param {*} body
   * @return {*}
   * @memberof ApiService
   */
  postResponseText(path: string, body: any): Observable<any> {
    return this.http.post(`${environment.API_URL}${path}`, body, {responseType: 'text'});
  }

  /**
   * Calls Post Api to server with API URL From Environment
   *
   * @param {string} path
   * @param {*} body
   * @return {*}
   * @memberof ApiService
   */
  postProgress(path: string, body: any): Observable<any> {
    return this.http.post(`${environment.API_URL}${path}`, body, {
      reportProgress: true,
      observe: 'events'
    });
  }

  /**
   * Calls Delete Api to server with API URL From Environment
   *
   * @param {string} path
   * @return {*}
   * @memberof ApiService
   */
  delete(path: string, body: any = {}): Observable<any> {
    return this.http.delete(`${environment.API_URL}${path}`, body);
  }

  /**
   * Calls Put Api to server with API URL From Environment
   *
   * @param {string} path
   * @return {*}
   * @memberof ApiService
   */
  put(path: string, body: any = {}): Observable<any> {
    return this.http.put(`${environment.API_URL}${path}`, body);
  }

  /**
   * Calls Put Api to server with API URL From Environment
   *
   * @param {string} path
   * @param {*} body
   * @return {*}
   * @memberof ApiService
   */
  putResponseText(path: string, body: any): Observable<any> {
    return this.http.put(`${environment.API_URL}${path}`, body, {responseType: 'text'});
  }

  cacheAPI<T>(returnObservable: () => Observable<T>, key?: string, customCache: {[key: string]: Observable<T>} = {}): Observable<T> {
    if (!!key && customCache && customCache[key]) {
      return customCache[key] as Observable<T>;
    }
    let replay = new ReplaySubject<T>(1);
    returnObservable().subscribe({
      next: (x) => replay.next(x),
      error: (x) => replay.error(x),
      complete: () => replay.complete()
    });
    let observable = replay.asObservable();
    if (!!key) {
      customCache[key] = observable;
    }
    return observable;
  }

  getJson(path: string, params: any): Observable<any> {
    return this.http.get(`${path}`, {params});
  }

  viewFile(value: string) {
    if (!!value) {
      const name = value.split('.');
      const isPdf = name[name.length - 1]?.toLowerCase() === 'pdf';
      if (isPdf) {
        this.getArrayBuffer('Common/DownloadFiles', {fileName: this.getFileName(value)}).subscribe((res) => {
          const file = new Blob([res], {type: 'application/pdf'});
          const fileURL = window.URL.createObjectURL(file);

          let width = window.outerWidth + 'px';
          let height = window.outerHeight + 'px';
          window.open(fileURL, '_blank', `toolbar=no,scrollbars=yes,resizable=yes,top=0,left=0,width=${width},height=${height}`);
        });
      } else {
        window.open(`${environment.API_URL.replace('/api', '')}${this.getFileName(value)}`, '_blank');
      }
    }
  }

  private getFileName(value: string): string {
    let result = value?.replace(/\\/g, '/');
    result = result?.substring(result?.lastIndexOf('/') + 1);
    return result || '';
  }
}
