import { Component } from 'angular2/core';
import { NgForm } from 'angular2/common';
import { RouterLink, Router } from 'angular2/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
	selector: 'sign-up',
	template: require('./template/signup.component.html'),
	directives: [RouterLink]
})
export class SignupComponent {
	userName: string;
	userEmail: string;
	userPassword: string;

	constructor(private router: Router, private authService: AuthService) { }

	onSubmit() {
		this.signUp();
	}

	signUp() {
		this.authService.signUp(this.userName, this.userEmail, this.userPassword)
						.subscribe(
							isAuthorized => {
								if (isAuthorized) {
									this.router.navigate(['/Home']);
								}
							},
							error => {
								//show error modal
								alert('Something went wrong. Look at logs');
							}
						);
	}
};
