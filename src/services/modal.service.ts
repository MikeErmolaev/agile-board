import { Injectable } from 'angular2/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ModalService {
	private modalToOpenSubject = new Subject();

	openModal(modalType) {
		this.modalToOpenSubject.next(modalType);
	}

	getModalSubject() {
		return this.modalToOpenSubject;
	}
	
}