import { Component } from 'angular2/core';
import { NgForm } from 'angular2/common';
import { RouterLink, Router } from 'angular2/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
	selector: 'log-in',
	template: require('./template/login.component.html'),
	styles: [require('./style/login.component.styl')],
	directives: [RouterLink]
})
export class LoginComponent { 
	constructor(private router: Router, private authService: AuthService) { }

	onSubmit(credentials) {
		this.logIn(credentials);
	}

	logIn(credentials) {
		this.authService.logIn(credentials.email, credentials.password)
						.subscribe(
							isAuthorized => {
								this.router.navigate(['/Home']);
							},
							error => {
								//show error modal
								alert(error);
							}
						);
	}
};
