import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { config } from '../conf';
import { extractData } from '../utils/http.utils';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { RequestService } from './request.service';
import { User } from '../entities/user';
import * as _ from 'lodash';

const { serverUrl } = config;

@Injectable()
export class AuthService {
	private _isLoggedIn: boolean = null;

	constructor (private http: Http, private storageService: StorageService, private userService: UserService, private requestService: RequestService) { }

	logIn(email: string, password: string) {
		const payload = {
			email,
			password
		}

		const body = this.requestService.getBody(payload);

		return this.http.post(`${serverUrl}/api/login`, body)
						.map(extractData)
						.map(data => {
							if (data.success) {
								this.storageService.setAuthToken(data.token);
								this.userService.setCurrentUser(data.user);
								this._isLoggedIn = true;
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

		const body = this.requestService.getBody(payload);

		return this.http.post(`${serverUrl}/api/signup`, body)
						.map(extractData)
						.map(data => {
							if (data.success) {
								this.storageService.setAuthToken(data.token);
								this.userService.setCurrentUser(data.user);
								this._isLoggedIn = true;
							}

							return data.success;
						})
						.catch(this.handleError);
	}

	authorize() {
		return this.http.get(`${serverUrl}/api/protected/authorize`, { headers: this.requestService.getAuthHeaders() })
						.map(extractData)
						.map(data => {
							if (data.success) {
								this._isLoggedIn = true;
								this.userService.setCurrentUser(data.user);
							}

							return data.success;
						})
						.catch(this.handleError);
	}

	logOut() {
		this.storageService.removeAuthToken();
		this.userService.removeCurrentUser();
		this._isLoggedIn = false;
	}

	isAuthorized() {
		const authService = this;
		
		return new Promise((resolve, reject) => {
			if (!_.isNull(authService._isLoggedIn)) {
				resolve(authService._isLoggedIn);
			} else {
				if (authService.storageService.hasAuthToken() && !authService._isLoggedIn) {
					authService.authorize().subscribe(
							isAuthorized => {
								resolve(isAuthorized);
							},
							error => {
								authService._isLoggedIn = false;
								resolve(authService._isLoggedIn);
							}
						)
				} else {
					resolve(false);
				}
			}

		}); 
	}

	private handleError(error: any) {
		const errorMessage = error.message || 'Server error';
		console.error(errorMessage);
		return Observable.throw(errorMessage);
	} 
};
