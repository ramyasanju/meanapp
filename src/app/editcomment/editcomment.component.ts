import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-editcomment',
  templateUrl: './editcomment.component.html',
  styleUrls: ['./editcomment.component.css']
})
export class EditcommentComponent implements OnInit {
  comment_id: any
  comment_text: any
  model: any
  message: any
  post_id: any

  constructor(private router: Router,private route: ActivatedRoute, private _http: Http) {
    this.route.queryParams.subscribe(params => {
    this.comment_id = params["commentId"];
    console.log("comment id in child page to be updated",this.comment_id)
    this.post_id = params["post_id"];
    console.log("post id in child page",this.post_id)

    // this.comment_text = params["commentToBeEdited"];
    // console.log("post description in child page",this.comment_text)
    })

    this._http.get("/api/commentText/"+this.comment_id).subscribe(res => {
      console.log("iiiiiiiiiiiiiiiiii",JSON.parse(res['_body']))
      var test = JSON.parse(res['_body']);
      if( test.success == true ) {
        // this.message = test.message
        this.comment_text = test.data.comment
       console.log("ccccccccccccccccccccc",this.comment_text)
      } else {
        this.message = test.message
        
      }
     });


  }
  ngOnInit() {}



  editComment(commentUpdateForm: NgForm) {
    console.log("i am inside submit post method ");
    this.model = commentUpdateForm.value;
    this.model.commentid = this.comment_id
    this._http.post("/api/editComment",this.model).subscribe((res) => {
      console.log(typeof res)
      console.log(res)
      var test = JSON.parse(res['_body']);
      console.log(test.success,'ttttttttttt');
      if( test.success == true ) {
        console.log(" i am inside component if");
        this.message = test.message
        commentUpdateForm.reset();
        console.log("bbbefore navigating postid is", this.post_id)
        this.router.navigate(['./commentpost'], { queryParams: {post_id: this.post_id  } });
        
        // this.router.navigate(['editcomment']);
        
        
      } else {
        console.log(" i am inside component else");
        this.message = test.message
      }
    })
    
  }

}
