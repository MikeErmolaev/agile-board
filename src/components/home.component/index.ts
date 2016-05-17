import { Component } from 'angular2/core';
import { RouteConfig } from 'angular2/router';
import { HeaderComponent } from '../header.component';
import { OverviewComponent } from '../overview.component';
import { UserService } from '../../services/user.service';
import { User } from '../../entities/user';
import { BoardComponent } from '../board.component';
import { LoggedInRouterOutlet } from '../../directives/logged-in-router-outlet.directive';

@Component({
    selector: 'home',
    template: require('./template/home.component.html'),
	directives: [LoggedInRouterOutlet, HeaderComponent],
	providers: []
})
@RouteConfig([
	{
		path: '/',
		name: 'Overview',
		component: OverviewComponent,
		useAsDefault: true
	},
	
	{
		path: '/board/:id',
		name: 'Board',
		component: BoardComponent
	}
])
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