import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';  


@Injectable()
export class LoginguardService implements CanActivate{

  constructor(private _router:Router) { }
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('userid') == null)
    {
      // alert('you are not logged in');
      console.log("canActivate");
      return true    //remove comments to return true

    }
    else{
      alert('i am already logged in');       
      this._router.navigate(["posts"]);       
      return false;

    }
            
       
  } 

}
