import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { RequestService } from './request.service';
import { UserService } from './user.service';
import { extractData } from '../utils/http.utils';
import { config } from '../conf';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const serverUrl = config.serverUrl;

@Injectable()
export class BoardService {
	private currentBoard = new BehaviorSubject({});

	constructor(private http: Http, private requestService: RequestService, private userService: UserService) { }

	setCurrentBoard(boardData) {
		console.log('Board info updated. New value - ');
		console.dir(boardData);
		
		this.currentBoard.next(boardData);
	}

	getCurrentBoardSubject() {
		return this.currentBoard;
	}

	loadBoardData(boardId) {
		return this.http.get(`${serverUrl}/api/protected/board/${boardId}`, { headers: this.requestService.getAuthHeaders() })
						.map(extractData)
						.map(this.updateBoard);
	}

	addColumn(columnTitle, boardId) {
		const body = this.requestService.getBody({ columnTitle, boardId });
		const authHeaders = this.requestService.getAuthHeaders();

		return this.http.post(`${serverUrl}/api/protected/column/add`, body, { headers: authHeaders })
						.map(extractData)
						.map(this.updateBoard);
	}

	deleteColumn(columnId) {
		const authHeaders = this.requestService.getAuthHeaders();

		return this.http.delete(`${serverUrl}/api/protected/column/delete/${columnId}`, { headers: authHeaders })
						.map(extractData)
						.map(this.updateBoard);
	}

	addCard(title, columnId, boardId) {
		const authHeaders = this.requestService.getAuthHeaders();
		const body = this.requestService.getBody({ title, columnId, boardId });
		console.log(body);
		return this.http.post(`${serverUrl}/api/protected/card/add`, body, { headers: authHeaders })
						.map(extractData)
						.map(this.updateBoard);
	}

	private updateBoard = data => {
		if (data.success) {
			this.setCurrentBoard(data.board);
		}

		return data.success;
	}
	
}