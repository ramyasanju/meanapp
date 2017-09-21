import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  model: any = {};
  message: string = '';
  constructor(private _dataService: DataService, private _http: Http, private router: Router) { }

  ngOnInit() {
  }
  registerUser(contactForm: NgForm) {
    console.log (" i am inside registerUser function");
    this.model = contactForm.value;
    console.log(this.model)
    this._http.post("/api/adduser",this.model).subscribe((res) => {
      console.log(typeof res)
      console.log(res)
      var test = JSON.parse(res['_body']);
      console.log(test.success,'ttttttttttt');
      if( test.success == true ) {
        console.log(" i am inside component if");
        this.message = test.message
        contactForm.reset();
        this.router.navigate(['registration']);
        
        
      } else {
        console.log(" i am inside component else");
        this.message = test.message
      }
    })
    

    // this._dataService.addUser(this.model)
    // this.router.navigate(['login']);



  }
}
