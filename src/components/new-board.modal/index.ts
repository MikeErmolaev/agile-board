import { Component, EventEmitter, Output, ViewChild, Renderer } from 'angular2/core';
import { BoardService } from '../../services/board.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'modal',
    template: require('./template/new-board.modal.html'),
    styles: [require('./style/new-board.modal.styl')],
    directives: []
})
export class NewBoardModal { 
	@Output() onShouldBeRemoved = new EventEmitter<boolean>();
	@ViewChild('title') titleInputElementRef;

	constructor(private renderer: Renderer, private boardService: BoardService, private userService: UserService) { }

	closeModal() {
		this.onShouldBeRemoved.emit(true);
	}

	createBoard(title: string, team?: string) {
		if (!title) {
			this.renderer.invokeElementMethod(this.titleInputElementRef.nativeElement, 'focus', []);
		}

		this.userService.addUserBoard(title, team).subscribe(result => {
			this.closeModal();
		},
		error => {
			//show error modal
			alert('Something went wrong. \n' + error);
		});
	}	
};