import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';

@Component({
    selector: 'welcome',
    template: require('./template/welcome.component.html'),
    styles: [require('./style/welcome.component.styl')],
    directives: [ROUTER_DIRECTIVES]
})
export class WelcomeComponent { };