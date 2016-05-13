import { Component } from 'angular2/core';
import { RouteConfig } from 'angular2/router';
import { LoggedInRouterOutlet } from '../../directives/logged-in-router-outlet.directive';
import { LoginComponent } from './child_components/login.component';
import { SignupComponent } from './child_components/signup.component'; 

@Component({
	selector: 'auth-component',
	template: `
		<div class="auth">
			<logged-in-router-outlet></logged-in-router-outlet>
		</div>
	`,
	directives: [LoggedInRouterOutlet]
})
@RouteConfig([
	{ path: '/login', name: 'Login', component: LoginComponent },
	{ path: '/signup', name: 'Signup', component: SignupComponent }
])
export class AuthComponent { };