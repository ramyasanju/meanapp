import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { EditpostComponent } from '../editpost/editpost.component';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  welcomemessage = localStorage.getItem('username')
  model: any={}
  message: string = '';
  user_id = localStorage.getItem('userid')
  postcount:any
  posts: Array<any>;
  postinfo: any
  filterId = 1
  
  // post_count =postcount(localStorage.getItem('userid')); 

  constructor(private router: Router, private _http: Http) {
    this.post_count(this.user_id);
    this.getpost(this.user_id);


   }

  ngOnInit() {
    
  }


  getValueFromFilter(postType,sortType)
  {
    console.log("i am inside filter component")
    console.log("postType",postType)
    console.log("sortType",sortType)

    if (postType ==-1)
    {
      postType =this.user_id 
    } 
    
    this._http.get("/api/postsWithFilter/"+postType+"/"+sortType).subscribe(res => {
      console.log(JSON.parse(res['_body']))

       this.posts = JSON.parse(res['_body']).data;
    });


  }
  

  //getAllPost
  getpost(uid){

    console.log("i am inside getpost function")
    console.log(uid)
    this._http.get("/api/posts").subscribe(res => {
      console.log(JSON.parse(res['_body']))

       this.posts = JSON.parse(res['_body']).data;
     });
     

  }

  //Redirecting to commentpost component
  comment_redirect(postid){
    console.log("in commentpost redirect function. Postid is",postid)  
    this.router.navigate(['./commentpost'], { queryParams: {  post_id: postid  } }); 
  }

  //Redirecting to editpost component
  edit_redirect(postid){
    console.log("in editpost redirect function. Postid is",postid) 
    this.router.navigate(['./editpost'], { queryParams: {post_id: postid  } });     
  }


  //get Post Count 
  post_count(uid) {
    
    console.log("i am inside postcount function")
    console.log(uid)
    this._http.get("/api/postcount/"+uid).subscribe(res => {
      console.log(JSON.parse(res['_body']).data.postcount)

       this.postcount = JSON.parse(res['_body']).data.postcount;
     });
     
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
        this.post_count(this.user_id);
        this.getpost(this.user_id);
        this.router.navigate(['posts']);
        
        
      } else {
        console.log(" i am inside component else");
        this.message = test.message
      }
    })
    
  }


  //Delete the post
  delete_Post(postId)
  {
    console.log("i am inside deletepost function");
    console.log("th post id i received for delete is",postId)
    this.user_id = localStorage.getItem('userid')
    this._http.delete("/api/delete_post/"+postId+"/"+ this.user_id).subscribe((res) => {
      console.log(typeof res)
      console.log(res)
      var test = JSON.parse(res['_body']);
      console.log(test.success,'ttttttttttt');
      if( test.success == true ) {
        console.log(" i am inside delete component if");
        this.message = test.message
        this.post_count(this.user_id);
        this.getpost(this.user_id);
        this.router.navigate(['posts']);
        
        
      } else {
        console.log(" i am inside delete component else");
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
