import { provide } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { ROUTER_PROVIDERS } from 'angular2/router';
import { HTTP_PROVIDERS,  BaseRequestOptions, RequestOptions, Headers } from 'angular2/http';
import { AppComponent } from './components/app.component';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';

class HttpOptions extends BaseRequestOptions {
	constructor() {
		super()
		this.headers.append('Content-Type', 'application/json');
	}
}

bootstrap(AppComponent, [
	ROUTER_PROVIDERS,
	HTTP_PROVIDERS,
	AuthService,
	StorageService,
	provide(RequestOptions, {useClass: HttpOptions})
]);