import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';

@Component({
    selector: 'home',
    template: `
	    <h1>Welcome to agile-board!</h1>
	    <h2>Please log in to get access to our services</h2>
	    <a [routerLink]="['Registration']">Register</a>
	    <a [routerLink]="['Login']">Log in</a>	    
	`,
	directives: [ROUTER_DIRECTIVES],
	providers: []
})
export class HomeComponent { };