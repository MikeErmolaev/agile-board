import { Injectable } from 'angular2/core';
import { Http, Response, Headers, RequestOptions } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { config } from '../conf';
import { extractData } from '../utils/http.utils';
import { StorageService } from './storage.service';

@Injectable()
export class AuthService {
	private isLoggedIn: boolean = false;

	constructor (private http: Http, private storageService: StorageService) {
		this.isLoggedIn = !!this.storageService.getAuthToken();
	}

	logIn(email: string, password: string) {
		const payload = {
			email,
			password
		}

		const body = JSON.stringify(payload);

		return this.http.post(`${config.serverUrl}/api/login`, body)
						.map(extractData)
						.map(data => {
							if (data.success) {
								this.storageService.setAuthToken(data.token);
								this.isLoggedIn = true;
							}

							return data.success;
						})
						.catch(this.handleError);
	}

	signUp(name: string, email: string, password: string) {
		const payload = {
			name,
			email,
			password
		}

		const body = JSON.stringify(payload);

		return this.http.post(`${config.serverUrl}/api/signup`, body)
						.map(extractData)
						.map(data => {
							if (data.success) {
								this.storageService.setAuthToken(data.token);
								this.isLoggedIn = true;
							}

							return data.success;
						})
						.catch(this.handleError);
	}

	logOut() {
		this.storageService.removeAuthToken();
		this.isLoggedIn = false;
	}

	isAuthorized() {
		return this.isLoggedIn;
	}

	private handleError(error: any) {
		const errorMessage = error.message || 'Server error';
		console.error(errorMessage);
		return Observable.throw(errorMessage);
	} 
};
