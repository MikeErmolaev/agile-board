import { Component, Input } from 'angular2/core';
import { Router } from 'angular2/router';
import { User } from '../../entities/user';
import { ModalService } from '../../services/modal.service';
import { BoardService } from '../../services/board.service';
import { UserService } from '../../services/user.service';
import { NewBoardModal } from '../new-board.modal';

@Component({
	selector: 'board-list',
	template: require('./template/board-list.component.html'),
	styles: [require('./style/board-list.component.styl')]
})
export class BoardListComponent {
	@Input() currentUser: User;

	constructor(private router: Router, private modalService: ModalService, private boardService: BoardService, private userService: UserService) { }

	createNewBoard() {
		this.modalService.openModal(NewBoardModal);
	}

	deleteBoard(boardId, event) {
		event.stopPropagation();
		this.userService.deleteUserBoard(boardId).subscribe(
			result => {
				//TODO: show toast
			},
			error => {
				console.error(error);
			}
		);
	}

	goToBoard(boardId) {
		this.boardService.loadBoardData(boardId).subscribe(
			result => {
				this.router.navigate(['Board', { id: boardId }]);
			},
			error => {
				console.error(error);
			}
		);
	}
}
