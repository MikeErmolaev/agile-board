import { Component } from 'angular2/core';
import { ModalService } from '../../services/modal.service';
import { NewBoardModal } from '../new-board.modal';

@Component({
	selector: 'modal-container',
	template: require('./template/modal-container.component.html'),
	styles: [require('./style/modal-container.component.styl')],
	directives: [NewBoardModal]
})
export class ModalContainer {
	private modalStack = [];

	constructor(private modalService: ModalService) {
		modalService.getModalSubject().subscribe(modalType => {
			this.modalStack.push(modalType);
		});
	}

	onShouldBeRemoved() {
		this.closeModal();
	}

	closeModal() {
		this.modalStack.pop();
	}
};