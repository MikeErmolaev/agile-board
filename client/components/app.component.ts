import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import { HomeComponent } from './home.component';
import { SignupComponent } from './signup.component';
import { LoginComponent } from './login.component';
// import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app',
    template: `
    	<div [routerLink]="['Home']">GO HOME</div>
	    <router-outlet></router-outlet>  
	    <footer>Footer</footer>
	`,
	directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
	{
		path: '/home',
		name: 'Home',
		component: HomeComponent,
		useAsDefault: true
	},
	{
		path: '/registration',
		name: 'Registration',
		component: SignupComponent
	},
	{
		path: '/login',
		name: 'Login',
		component: LoginComponent
	}
])
export class AppComponent {
	// constructor() { }
};