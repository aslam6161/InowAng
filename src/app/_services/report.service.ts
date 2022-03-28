import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Payload } from '../_models/payload';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }
  generateRandom(payload: Payload) {

   console.log(payload);
    return this.http.post(environment.apiUrl+'/StartGeneratingRandomNumber', payload);
}

stopRandom() {
   return this.http.get(environment.apiUrl+'/Stop');
}

getReportInfo() {
  return this.http.get(environment.apiUrl+'/GetReportData');
}

  
}
