import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.component.html',
  styleUrls: ['./editpost.component.css']
})
export class EditpostComponent implements OnInit {
  
  postTitle: any
  postDesc: any
  postTags: any
  postId: any
  postedDate: any
  model: any={}
  message: string = '';
  user_id: any;


  constructor(private router: Router,private route: ActivatedRoute, private _http: Http) { 
    this.route.queryParams.subscribe(params => {
      this.postId = params["post_id"];
      console.log("post id in child page",this.postId)     
    });
    this._http.get("/api/postdetails/"+this.postId).subscribe(res => {
      console.log("post details are ",JSON.parse(res['_body']).data)

      this.postTitle = JSON.parse(res['_body']).data.title
      this.postDesc = JSON.parse(res['_body']).data.description
      this.postTags = JSON.parse(res['_body']).data.tags
      this.postedDate = JSON.parse(res['_body']).data.posted_date
    })



  }

  ngOnInit() {
  }


  editpost(updatePostsForm: NgForm) {
    console.log("i am inside submit post method ");
    this.model = updatePostsForm.value;
    this.user_id = localStorage.getItem('userid')
    this.model.userid = this.user_id
    this.model.postid = this.postId
    this.model.posted_date = this.postedDate

    // console.log("the type os this.model is", typeof this.model)
    // console.log("the value of this.model", this.model)
    console.log("the userid is ",this.user_id)
    this._http.post("/api/updatePost",this.model).subscribe((res) => {
      console.log(typeof res)
      console.log(res)
      var test = JSON.parse(res['_body']);
      console.log(test.success,'ttttttttttt');
      if( test.success == true ) {
        console.log(" i am inside component if");
        this.message = test.message
        updatePostsForm.reset();
        this.router.navigate(['editpost']);       
        
      } else {
        console.log(" i am inside component else");
        this.message = test.message
      }
    })
    
  }

  logout() {
    console.log("i am inside logout function");
    console.log("the userid value before logout is", localStorage.getItem('userid') )
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    console.log("the userid value after logout is", localStorage.getItem('userid') )
    this.router.navigate(['login'])
  }
}
