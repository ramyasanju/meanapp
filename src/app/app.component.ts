import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  userid = localStorage.getItem('userid');
  status: boolean = false;
  // s: any;
  
  
  
  
  users: Array<any>;
  
    
  constructor(private _dataService: DataService) {

    // this.s = localStorage.getItem('userid');
    // console.log("outside if",this.s)
    // if (this.s != null) {
    //   console.log("s value is",this.s)
    //   this.status = true
    // }
    
    this._dataService.getUsers()
          .subscribe(res => this.users = res);
  }
}
