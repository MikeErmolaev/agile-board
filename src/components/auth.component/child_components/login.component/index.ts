import { Component } from 'angular2/core';
import { NgForm } from 'angular2/common';
import { RouterLink, Router } from 'angular2/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
	selector: 'log-in',
	template: require('./template/login.component.html'),
	directives: [RouterLink]
})
export class LoginComponent { 
	userEmail: string;
	userPassword: string;

	constructor(private router: Router, private authService: AuthService) { }

	onSubmit() {
		this.logIn();
	}

	logIn() {
		this.authService.logIn(this.userEmail, this.userPassword)
						.subscribe(
							isAuthorized => {
								this.router.navigate(['/Home']);
							},
							error => {
								//show error modal
								alert('Something went wrong. Look at logs');
							}
						);
	}
};
