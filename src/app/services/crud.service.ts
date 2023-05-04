import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiRoutes } from '../Enums/apiRoutes.enum';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  baseUrl = environment.baseAPI;
  constructor(private http: HttpClient) { }


  add(question: any) {
    return this.http.post(`${this.baseUrl + ApiRoutes.FAQs}`, question)
  }

  getById(id: number) {
    return this.http.get<any[]>(`${this.baseUrl + ApiRoutes.FAQs}`)
  }
}
