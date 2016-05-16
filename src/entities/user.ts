import { Board } from './board';

export class User {
  constructor(public id: number, public name: string, public email: string, public boards: Array<Board>) { }

  setBoards(boards) {
	  this.boards = boards;
  }

}
