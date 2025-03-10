import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Job } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }
  private baseUrl='https://jobicy.com/api/v2';

  getJobs(count: number = 50, geo?: string, tag?: string): Observable<{ jobs: Job[] }> {
    let url = `${this.baseUrl}/remote-jobs?count=${count}`;
    if (geo) {
      url += `&geo=${geo}`;
    }    

    if (tag) {
      url += `&tag=${tag}`;
    }
    return this.http.get<{ jobs: Job[] }>(url);
  }
  
  

}
