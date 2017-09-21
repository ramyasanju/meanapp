import { Component, OnInit,ElementRef, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {ActivatedRoute} from "@angular/router";
import "rxjs/add/operator/do";
//import the map function to be used with the http library
import "rxjs/add/operator/map";
const URL = 'api/upload';



@Component({
  selector: 'app-commentpost',
  templateUrl: './commentpost.component.html',
  styleUrls: ['./commentpost.component.css']
})
export class CommentpostComponent implements OnInit {
  welcomemessage = localStorage.getItem('username')
  postTitle: any
  postDesc: any
  postTags: any
  postId: any
  model: any={}
  message: string = '';
  user_id = localStorage.getItem('userid')
  comments: any
  commentToBeEdited: any
  commentText: any
  img_path: any
  
  
  

  constructor(private router: Router,private route: ActivatedRoute, private _http: Http, private el: ElementRef) {
    this.route.queryParams.subscribe(params => {
      this.postId = params["post_id"];
      console.log("post id in child page",this.postId)
      // this.commentText = params["commentToBeEdited"]
      // console.log("comment text in child page",this.commentText)
      
    });

    this._http.get("/api/postdetails/"+this.postId).subscribe(res => {
      console.log("post details are ",JSON.parse(res['_body']).data)

      this.postTitle = JSON.parse(res['_body']).data.title
      this.postDesc = JSON.parse(res['_body']).data.description
      this.postTags = JSON.parse(res['_body']).data.tags
    })

    this.getcomments(this.postId)
  }

  ngOnInit() {
    
  }


  fileEvent(fileInput: any){
     var file = fileInput.target.files[0];
     console.log("the file is",file)    
  }

  upload() {
        let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
        let fileCount: number = inputEl.files.length;
        let formData = new FormData();
        if (fileCount > 0) { // a file was selected
          formData.append('photo', inputEl.files.item(0));              
          this._http.post(URL, formData).subscribe((res) => {
            console.log("the final response for image upload is",res)
            this.img_path = res['_body']
            console.log("the image upload this.model before is", this.img_path)
            if(res['status'] == 200){
              this.photoCommentPost(res['_body'])
              // this.getcomments(this.postId)
              // this.router.navigate(['./commentpost'], { queryParams: {post_id: this.postId  } });
            }
            else{
              console.log(" i am inside component else");
              this.message = "error in uploading picture comment"

            }
                    
          })
          
        }
        
  }

  photoCommentPost(saved_url){
    this.user_id = localStorage.getItem('userid')
    this.model.userid = this.user_id
    this.model.postid = this.postId
    this.model.image_url = saved_url
    this.model.comment = " "
    console.log("the image upload this.model is", this.model.image_url)
    this._http.post("/api/commentPost",this.model).subscribe((res) => {
      console.log(typeof res)
      console.log(res)
      var test = JSON.parse(res['_body']);
      if( test.success == true ) {
        this.message = test.message
        
        this.getcomments(this.postId)
        this.router.navigate(['./commentpost'], { queryParams: {post_id: this.postId  } });
        
        
      } else {
        console.log(" i am inside component else");
        this.message = test.message
      }
    })


  }


  getcomments(postID){
    console.log("i am inside get comments function")
    this._http.get("/api/comments/"+postID).subscribe(res => {
      console.log("iiiiiiiiiiiiiiiiii",JSON.parse(res['_body']))

       this.comments = JSON.parse(res['_body']);
       console.log("ccccccccccccccccccccc",this.comments)
     });
     
  }

  //Delete the comment for the given comment id
  delete_Comment(comment_id){
    this._http.delete("/api/deleteComment/"+comment_id,this.model).subscribe((res) => {
      console.log(typeof res)
      console.log(res)
      var test = JSON.parse(res['_body']);
      if( test.success == true ) {
        this.message = test.message
        this.getcomments(this.postId)
        this.router.navigate(['./commentpost'], { queryParams: {post_id: this.postId  } });
        
        
      } else {
        console.log(" i am inside component else");
        this.message = test.message
      }
    })

  }
  commentPost(commentPostsForm: NgForm) {
    console.log("i am inside submit post method ");
    this.model = commentPostsForm.value;
    this.user_id = localStorage.getItem('userid')
    this.model.userid = this.user_id
    this.model.postid = this.postId
    
    // console.log("the type os this.model is", typeof this.model)
    // console.log("the value of this.model", this.model)
    
    this._http.post("/api/commentPost",this.model).subscribe((res) => {
      console.log(typeof res)
      console.log(res)
      var test = JSON.parse(res['_body']);
      if( test.success == true ) {
        this.message = test.message
        commentPostsForm.reset();
        this.getcomments(this.postId)
        this.router.navigate(['./commentpost'], { queryParams: {post_id: this.postId  } });
        
        
      } else {
        console.log(" i am inside component else");
        this.message = test.message
      }
    })
    
  }


  edit_Comment_redirect(comment_id,){
    this.router.navigate(['./editcomment'], { queryParams: { commentId: comment_id, post_id: this.postId  } });

  }

  // edit_Comment_redirect(comment_id,comment_text){
  //   this.router.navigate(['./editcomment'], { queryParams: { commentId: comment_id, commentToBeEdited: comment_text  } });

  // }


  logout() {
    console.log("i am inside logout function");
    console.log("the userid value before logout is", localStorage.getItem('userid') )
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    console.log("the userid value after logout is", localStorage.getItem('userid') )
    this.router.navigate(['login'])
  }

}
