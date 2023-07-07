export class Door {
  x: number = 0;
  y: number = 0;
  width: number = 10;
  height: number = 10;
}

export class Room {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  borderSize: number = 3;
  roomState: string = 'not started';
  doors?: Set<Door> = new Set<Door>();
}

export default class CanvasObject {
  _id: string = '';
  user: string = '';
  type: string = ''; // house or apartment
  address: string = '';
  area: number = 0;
  roomNum: number = 0;
  doors: Door[] = [];
  rooms: Room[] = [];
  beingCreated?: boolean;
}
