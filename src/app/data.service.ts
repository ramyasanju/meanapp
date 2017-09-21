import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class DataService {
  result:any;
  constructor(private _http: Http) { }
  getUsers() {
    console.log("i am inside getusers function service");
    return this._http.get("/api/users")
      .map(result => this.result = result.json().data);
  }


  addUser(data) {
    // let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    // let options       = new RequestOptions({ headers: headers }); // Create a request option
    return this._http.post("/api/adduser",data).subscribe();
      
  }

  checkUser(data) {
    return this._http.post("/api/checkuser",data).subscribe();
  }
}
