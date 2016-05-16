import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { RequestService } from './request.service';
import { UserService } from './user.service';
import { extractData } from '../utils/http.utils';
import { config } from '../conf';

const serverUrl = config.serverUrl;

@Injectable()
export class BoardService {
	constructor(private http: Http, private requestService: RequestService, private userService: UserService) { }

	deleteBoard(boardId) {
		const body = this.requestService.getBody({ boardId });

		return this.http.post(`${serverUrl}/api/protected/board/delete`, body, { headers: this.requestService.getAuthHeaders() })
				.map(extractData)
				.map(data => {
					if (data.success) {
						this.userService.setCurrentUser(data.user);
					}

					return data.success;
				});
	}
	
}