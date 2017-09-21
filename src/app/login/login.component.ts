import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
// import {WebStorageModule, LocalStorageService} from "angular-localstorage";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  message: string = '';

  constructor(private _http: Http, private router: Router) { }

  ngOnInit() {
  }

  loginUser(loginForm: NgForm) {
    console.log (" i am inside loginUser function");
    this.model = loginForm.value;
    console.log(this.model)
    this._http.post("/api/checkuser",this.model).subscribe((res) => {
      console.log(typeof res)
      console.log(res)
      var stat = JSON.parse(res['_body']);
      // console.log(stat.data._id,'ttttttttttt');

      if( stat.success == true ) {
        console.log(" i am inside component if");
        this.message = stat.message
        localStorage.setItem('userid',stat.data._id);
        localStorage.setItem('username',stat.data.uname);
        // loginForm.reset();
        this.router.navigate(['posts']);  
      } else {
        console.log(" i am inside component else");
        this.message = stat.message

        // loginForm.reset();
        this.router.navigate(['login']);
      }
    })
    

    // this._dataService.checkUser(this.model)
    // this.router.navigate(['registration']);



  }

}
// res => this.users = res