import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  user: string;
  constructor() { }

  IsLoggedIn() {
    return sessionStorage.getItem("user") && sessionStorage.getItem("user").length;
  }
}
