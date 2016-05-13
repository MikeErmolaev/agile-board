import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';

@Component({
    selector: 'home',
    template: require('./template/home.component.html'),
	directives: [ROUTER_DIRECTIVES],
	providers: []
})
export class HomeComponent { };