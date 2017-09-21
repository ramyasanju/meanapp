import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css']
})
export class AddpostComponent implements OnInit {
  welcomemessage = localStorage.getItem('username')
  model: any={}
  message: string = '';
  user_id = localStorage.getItem('userid')
  postcount:any
  posts: Array<any>;

  constructor(private router: Router, private _http: Http) { }

  ngOnInit() {
  }

  // Add Post
  submitpost(postsForm: NgForm) {
    console.log("i am inside submit post method ");
    this.model = postsForm.value;
    this.user_id = localStorage.getItem('userid')
    this.model.userid = this.user_id
    // console.log("the type os this.model is", typeof this.model)
    // console.log("the value of this.model", this.model)
    console.log("the userid is ",this.user_id)
    this._http.post("/api/addposts",this.model).subscribe((res) => {
      console.log(typeof res)
      console.log(res)
      var test = JSON.parse(res['_body']);
      console.log(test.success,'ttttttttttt');
      if( test.success == true ) {
        console.log(" i am inside component if");
        this.message = test.message
        postsForm.reset();
        // this.post_count(this.user_id);
        // this.getpost(this.user_id);
        this.router.navigate(['newpost']);
        
        
      } else {
        console.log(" i am inside component else");
        this.message = test.message
      }
    })
    
  }

  //Logout
  logout() {
    console.log("i am inside logout function");
    console.log("the userid value before logout is", localStorage.getItem('userid') )
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    console.log("the userid value after logout is", localStorage.getItem('userid') )
    this.router.navigate(['login'])
  }

}
