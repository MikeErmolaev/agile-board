import { Component } from 'angular2/core';
import { RouteConfig } from 'angular2/router';
import { WelcomeComponent } from '../welcome.component';
import { AuthComponent } from '../auth.component';
import { HomeComponent } from '../home.component';
import { LoggedInRouterOutlet } from '../../directives/logged-in-router-outlet.directive';
import { ModalContainer } from '../modal-container.component';

require('generic/main.styl');

@Component({
    selector: 'app',
    template: require('./template/app.component.html'),
	directives: [LoggedInRouterOutlet, ModalContainer]
})
@RouteConfig([
	{
		path: '/welcome',
		name: 'Welcome',
		component: WelcomeComponent
	},
	{
		path: '/auth/...',
		name: 'Auth',
		component: AuthComponent
	},
	{
		path: '/...',
		name: 'Home',
		component: HomeComponent,
		useAsDefault: true
	},
	{
		path: '/**',
		redirectTo: ['Home']
	}
])
export class AppComponent { };