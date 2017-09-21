import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';  


@Injectable()
export class PageguardService implements CanActivate{

  constructor(private _router:Router ) { }
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('userid') != null)
    {
      console.log("canActivate");
      return true    //remove comments to return true

    }
    else{
      alert('Please Login to view this page. You are redirected to Login Page');       
      this._router.navigate(["login"]);       
      return false;

    }
            
       
  } 

}
