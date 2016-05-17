import { Component } from 'angular2/core';
import { NgForm } from 'angular2/common';
import { RouterLink, Router } from 'angular2/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
	selector: 'sign-up',
	template: require('./template/signup.component.html'),
	styles: [require('./style/signup.component.styl')],
	directives: [RouterLink]
})
export class SignupComponent {
	constructor(private router: Router, private authService: AuthService) { }

	onSubmit(userInfo) {
		this.signUp(userInfo);
	}

	signUp(userInfo) {
		this.authService.signUp(userInfo.name, userInfo.email, userInfo.password)
						.subscribe(
							isAuthorized => {
								if (isAuthorized) {
									this.router.navigate(['/Home']);
								}
							},
							error => {
								//show error modal
								alert(error);
							}
						);
	}
};
