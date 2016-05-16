import { Injectable } from 'angular2/core';
import { Headers } from 'angular2/http';
import { StorageService } from './storage.service';

@Injectable()
export class RequestService{
	constructor(private storageService: StorageService) { }

	getAuthHeaders() {
		const headers = this.getJsonHeaders();
		const authToken = this.storageService.getAuthToken();

		headers.append('Authorization', `Bearer ${authToken}`);
		return headers;
	}

	getJsonHeaders() {
		const headers = new Headers();

		headers.append('Content-Type', 'application/json');
		return headers;
	}

	getBody(payload) {
		return JSON.stringify(payload); 
	}
}