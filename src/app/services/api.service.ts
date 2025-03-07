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

  getJobs(count: number, geo: string, industry: string): Observable<{ jobs: Job[] }> {
    const url = `${this.baseUrl}/remote-jobs?count=${count}&geo=${geo}&industry=${industry}`;
    return this.http.get<{ jobs: Job[] }>(url);
  }
  

}
