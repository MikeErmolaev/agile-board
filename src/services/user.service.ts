import { Injectable } from 'angular2/core';
import { User } from '../entities/user';
import { Http } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { RequestService } from './request.service';
import { extractData } from '../utils/http.utils';
import { config } from '../conf';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';

const { serverUrl } = config;

@Injectable()
export class UserService {
	private currentUserSubject = new BehaviorSubject(null);

	constructor(private http: Http, private requestService: RequestService) { }

	setCurrentUser(userData) {
		const { id, email, name, boards } = userData;
		const newUser = new User(id, name, email, boards);

		console.log('User info updated. New value - ');
		console.dir(newUser);

		this.currentUserSubject.next(newUser);
	}

	getCurrentUserSubject() {
		return this.currentUserSubject;
	}

	removeCurrentUser() {
		this.currentUserSubject.next(null);
	}

	hasCurrentUser() {
		return !!this.currentUserSubject.getValue;
	}

	addUserBoard(title: string, team?: string) {
		const body = this.requestService.getBody({ title, team });

		return this.http.post(`${serverUrl}/api/protected/board/add`, body, { headers: this.requestService.getAuthHeaders() })
						.map(extractData)
						.map(this.updateUser);

	}

	deleteUserBoard(boardId) {
		return this.http.delete(`${serverUrl}/api/protected/board/delete/${boardId}`, { headers: this.requestService.getAuthHeaders() })
				.map(extractData)
				.map(this.updateUser);
	}

	private updateUser = data => {
		if (data.success) {
			this.setCurrentUser(data.user);
		}

		return data.success;
	}
};
