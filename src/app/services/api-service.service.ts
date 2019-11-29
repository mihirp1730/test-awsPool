import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseModel } from '../interfaces/response.model';

// New syntax for rxjs v6+, when headers are required
// ------------------------
const headers = new HttpHeaders()
            .set("Authorization", localStorage.getItem('jwtToken'));

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  testApi: string = environment.testApi;
  constructor(public http: HttpClient) { }

  getTestData(): Observable<ResponseModel> {
    console.log(headers);
    return this.http.get(this.testApi +'?' + 'color=1' )
    // return this.http.get(this.testApi +'?' + 'color=1')
      .pipe(map((response: any) => response))
  }
  getAuthData(): Observable<ResponseModel> {
    console.log(headers);
    return this.http.get(this.testApi+ '/' + 'auth' +'?' + 'color=1', {headers} )
    // return this.http.get(this.testApi + '/' + 'auth' + '?' + 'color=1')
      .pipe(map((response: any) => response))
  }
}


// Create OPTIONS method
// ✖ Add 200 Method Response with Empty Response Model to OPTIONS method 
// ✔ Add Mock Integration to OPTIONS method
// ✔ Add 200 Integration Response to OPTIONS method
// ✖ Add Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin Method Response Headers to OPTIONS method 
// ✖ Add Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin Integration Response Header Mappings to OPTIONS method 
// ✖ Add Access-Control-Allow-Origin Method Response Header to GET method 
// ✖ Add Access-Control-Allow-Origin Integration Response Header Mapping to GET method
