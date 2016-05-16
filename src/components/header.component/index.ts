import { Component, Input } from 'angular2/core';
import { Router } from 'angular2/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../entities/user';

@Component({
	selector: 'header-container',
	template: require('./template/header.component.html'),
	styles: [require('./style/header.component.styl')]
})
export class HeaderComponent {
	@Input() currentUser: User;

	constructor(private authService: AuthService, private router:Router) { }

	logOut() {
		this.authService.logOut();
		this.router.navigate(['Welcome']);
	}
};