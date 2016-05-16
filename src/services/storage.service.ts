import { Injectable } from 'angular2/core';
const TOKEN_KEY = 'auth-token';

@Injectable()
export class StorageService {
	getAuthToken() {
		return localStorage.getItem(TOKEN_KEY);
	}

	setAuthToken(token) {
		localStorage.setItem(TOKEN_KEY, token);
	}

	removeAuthToken() {
		localStorage.removeItem(TOKEN_KEY);
	}

	hasAuthToken() {
		return !!localStorage.getItem(TOKEN_KEY);
	}
}