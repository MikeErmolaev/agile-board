import { Component, OnInit, Renderer, ViewChild } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import { BoardService } from '../../services/board.service';
import { RouteParams } from 'angular2/router';
import * as _ from 'lodash';

@Component({
    selector: 'board',
    template: require('./template/board.component.html'),
    styles: [require('./style/board.component.styl')],
	directives: [ROUTER_DIRECTIVES],
	providers: []
})
export class BoardComponent implements OnInit {
	private currentBoard;
	@ViewChild('newColumn') newColumnInputElementRef;

	constructor(private boardService: BoardService, private params: RouteParams, private renderer: Renderer) {
		this.boardService.getCurrentBoardSubject().subscribe(
			boardData => {
				this.currentBoard = boardData;
			}
		);
	}

	ngOnInit() {
		if (_.isEmpty(this.currentBoard)) {
			const boardId = this.params.get('id');
			this.boardService.loadBoardData(boardId).subscribe();
		}
	}

	addColumn(title) {
		this.boardService.addColumn(title, this.currentBoard.id).subscribe(
			result => {
				this.renderer.setElementProperty(this.newColumnInputElementRef.nativeElement, 'value', '');
				//TODO: activity report
			},
			console.error
		);
	}

	deleteColumn(columnId) {
		//TODO: show confirmation modal
		this.boardService.deleteColumn(columnId).subscribe(
			result => {
				//TODO: activity report
			},
			console.error
		);
	}

	addCard(title, columnId) {
		this.boardService.addCard(title, columnId, this.currentBoard.id).subscribe(
			result => {
				//TODO: activity report
			},
			console.error
		);
	}
};