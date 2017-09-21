import { Routes } from '@angular/router';

import { LoginComponent} from './login/login.component'
import { RegistrationComponent} from './registration/registration.component'
import { PostComponent } from './post/post.component';
import { AddpostComponent } from './addpost/addpost.component';
import { EditpostComponent } from './editpost/editpost.component';
import { CommentpostComponent } from './commentpost/commentpost.component';
import { EditcommentComponent } from './editcomment/editcomment.component';
import { PageguardService } from './pageguard.service';
import { LoginguardService } from './loginguard.service';
 
export const appRoutes: Routes = [
  { path: '', component: LoginComponent, canActivate : [LoginguardService] },
  { path: 'login', component: LoginComponent, canActivate : [LoginguardService] },
  { path: 'registration', component: RegistrationComponent },
  // { path: 'registration/login', component: LoginComponent },
  // { path: 'login/registration', component: RegistrationComponent },
  // { path: 'login/registration/login', component: LoginComponent },
  { path: 'posts', component: PostComponent , canActivate : [PageguardService]},
  { path: 'newpost', component: AddpostComponent , canActivate : [PageguardService]},
  { path: 'editpost', component: EditpostComponent , canActivate : [PageguardService]},
  { path: 'commentpost', component: CommentpostComponent , canActivate : [PageguardService]},
  { path: 'editcomment', component: EditcommentComponent , canActivate : [PageguardService]},

];