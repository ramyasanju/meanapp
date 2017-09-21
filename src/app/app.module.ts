import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { DataService } from './data.service';
import { PageguardService } from './pageguard.service';
import { LoginguardService } from './loginguard.service';


import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { appRoutes } from './app.routes';
import { PostComponent } from './post/post.component';
import { AddpostComponent } from './addpost/addpost.component';
import { EditpostComponent } from './editpost/editpost.component';
import { CommentpostComponent } from './commentpost/commentpost.component';
import { EditcommentComponent } from './editcomment/editcomment.component';


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    PostComponent,
    AddpostComponent,
    EditpostComponent,
    CommentpostComponent,
    EditcommentComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [DataService, PageguardService,LoginguardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
