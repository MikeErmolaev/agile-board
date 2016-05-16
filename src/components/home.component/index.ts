import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import { BoardListComponent } from '../board-list.component';
import { HeaderComponent } from '../header.component';
import { UserService } from '../../services/user.service';
import { User } from '../../entities/user';

@Component({
    selector: 'home',
    template: require('./template/home.component.html'),
	directives: [ROUTER_DIRECTIVES, BoardListComponent, HeaderComponent],
	providers: []
})
export class HomeComponent {
	private currentUser: User;

	constructor(private userService: UserService) {
		userService.getCurrentUserSubject().subscribe(
			user => {
				this.currentUser = user;
			}
		);
	}
};