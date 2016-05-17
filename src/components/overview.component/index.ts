import { Component, Input } from 'angular2/core';
import { BoardListComponent } from '../board-list.component';
import { UserService } from '../../services/user.service';
import { User } from '../../entities/user';

@Component({
    selector: 'overview',
    template: require('./template/overview.component.html'),
	directives: [BoardListComponent],
	providers: []
})
export class OverviewComponent {
	private currentUser: User;

	constructor(private userService: UserService) {
		userService.getCurrentUserSubject().subscribe(
			user => {
				this.currentUser = user;
			}
		);
	}
};