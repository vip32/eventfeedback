import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private _router: Router,
    private _authService: AuthService) { }

  ngOnInit() {
    console.log('home init', this._authService.isAuthenticated);
    if (!this._authService.isAuthenticated) {
      console.log('redirecting to login');
      this._router.navigate(['/login']);
    }
  }
}
