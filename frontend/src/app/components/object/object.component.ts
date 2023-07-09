import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import CanvasObject, { Door, Room } from 'src/app/models/canvasObject';
import { CanvasValidateService } from 'src/app/services/canvas-validate.service';

@Component({
  selector: 'app-object-canvas',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css'],
})
export class ObjectComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private _canvasObject: CanvasObject | undefined;
  _hideForm: boolean = false;
  _modeRoomSelect: boolean = false;

  private ctx?: CanvasRenderingContext2D;

  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private draggedRoomIndex: number = -1;
  private draggedDoors: Set<Door> = new Set<Door>();
  private clickTimeout: any;
  private longClickFlag: boolean = false;
  private readonly SHORT_CLICK_DELAY = 100;

  CANVAS_WIDTH: number = 600;
  CANVAS_HEIGHT: number = 400;
  MAX_DOOR_WIDTH: number = 30;

  selectedRoom?: Room;
  selectedDoor?: Door;
  newRoomWidth: number = 200;
  newRoomHeight: number = 100;
  modeAddRoom: boolean = false;
  modeAddDoor: boolean = false;

  private reset() {
    this.selectedRoom = undefined;
    this.selectedDoor = undefined;
    this.newRoomWidth = 200;
    this.newRoomHeight = 100;
    this.modeAddRoom = false;
    this.modeAddDoor = false;
    this.draggedRoomIndex = -1;
    this.draggedDoors = new Set<Door>();

    this.isDragging = false;
  }

  @Input() set canvasObject(value: CanvasObject | undefined) {
    this._canvasObject = value;

    this.reset();

    if (value) {
      for (let door of this._canvasObject!.doors) {
        for (let room of this._canvasObject!.rooms) {
          if (!room.doors) {
            room.doors = new Set<Door>();
          }
          if (this.canvasValidateService.doorOnBorder(room, door)) {
            room.doors?.add(door);
            break;
          }
        }
      }
    }
    this.drawObject();
  }

  @Input() set hideForm(value: boolean) {
    this._hideForm = value;
  }

  @Input() set modeRoomSelect(value: boolean) {
    this._modeRoomSelect = value;
  }

  get hideForm(): boolean {
    return this._hideForm;
  }

  constructor(
    private toastr: ToastrService,
    private canvasValidateService: CanvasValidateService
  ) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    this.reset();

    // Set the canvas size to match the object dimensions
    canvas.width = this.CANVAS_WIDTH;
    canvas.height = this.CANVAS_HEIGHT;

    this.drawObject();
  }

  deleteSelected() {
    if (!this._canvasObject) {
      return;
    }

    const object: CanvasObject = this._canvasObject;
    if (this.selectedRoom !== undefined) {
      const room: Room = this.selectedRoom!;

      object.doors = object.doors.filter((door: Door) => {
        return !this.canvasValidateService.doorOnBorder(room, door);
      });

      object.rooms = object.rooms.filter((r: Room) => {
        return r !== room;
      });
      this.selectedRoom = undefined;
    }
    if (this.selectedDoor) {
      object.doors = object.doors.filter((door: Door) => {
        return door !== this.selectedDoor;
      });
      for (let room of object.rooms) {
        room.doors?.delete(this.selectedDoor);
      }

      this.selectedDoor = undefined;
    }
    this.drawObject();
  }

  @HostListener('tap', ['$event'])
  @HostListener('click', ['$event'])
  onClick(event: any) {
    if (!this._canvasObject || (this.hideForm && !this._modeRoomSelect)) {
      return;
    }

    if (this.longClickFlag) {
      this.longClickFlag = false;
      return;
    }

    const object: CanvasObject = this._canvasObject!;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let x: number = 0;
    let y: number = 0;
    if (event instanceof MouseEvent) {
      // Mouse event
      x = event.clientX;
      y = event.clientY;
    } else if (event instanceof TouchEvent) {
      // Touch event
      const touch = event.touches[0];
      x = touch.clientX;
      y = touch.clientY;
    }
    x = (x - rect.left) * scaleX;
    y = (y - rect.top) * scaleY;

    if (x < 0 || x > this.CANVAS_WIDTH || y < 0 || y > this.CANVAS_HEIGHT) {
      return;
    }

    if (this.modeRoomSelect) {
      // special mode
      this.selectRoom(x, y, object);
    } else {
      if (this.modeAddRoom) {
        // add a new room
        this.addRoom(x, y, object);
        this.modeAddRoom = false;
      } else if (this.modeAddDoor) {
        // add a new door (if able to validate)
        this.addDoor(x, y, object);
        this.modeAddDoor = false;
      } else {
        // Check if the click is inside a room
        this.selectRoom(x, y, object);

        // Check if the click is inside a door
        this.selectDoor(x, y, object);
      }
    }

    this.drawObject();
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onDragStart(event: any) {
    if (!this._canvasObject || this.hideForm) {
      return;
    }

    const object: CanvasObject = this._canvasObject;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let x: number = 0;
    let y: number = 0;
    if (event instanceof MouseEvent) {
      // Mouse event
      x = event.clientX;
      y = event.clientY;
    } else if (event instanceof TouchEvent) {
      // Touch event
      const touch = event.touches[0];
      x = touch.clientX;
      y = touch.clientY;
    }
    x = (x - rect.left) * scaleX;
    y = (y - rect.top) * scaleY;

    if (x < 0 || x > this.CANVAS_WIDTH || y < 0 || y > this.CANVAS_HEIGHT) {
      return;
    }

    // Start the click timeout
    this.clickTimeout = setTimeout(() => {
      this.longClickFlag = true;
    }, this.SHORT_CLICK_DELAY);

    for (let i = 0; i < object.rooms.length; i++) {
      const room = object.rooms[i];
      if (
        x >= room.x &&
        x <= room.x + room.width &&
        y >= room.y &&
        y <= room.y + room.height
      ) {
        this.selectRoom(x, y, object);
        this.isDragging = true;
        this.dragStartX = x;
        this.dragStartY = y;
        this.draggedRoomIndex = i;
        this.draggedDoors = room.doors!;
        return;
      }
    }
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  onDragMove(event: any) {
    if (this.isDragging) {
      const canvas = this.canvasRef.nativeElement;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      let x: number = 0;
      let y: number = 0;
      if (event instanceof MouseEvent) {
        // Mouse event
        x = event.clientX;
        y = event.clientY;
      } else if (event instanceof TouchEvent) {
        // Touch event
        const touch = event.touches[0];
        x = touch.clientX;
        y = touch.clientY;
      }
      x = (x - rect.left) * scaleX;
      y = (y - rect.top) * scaleY;

      const dx = x - this.dragStartX;
      const dy = y - this.dragStartY;

      const draggedRoom = this._canvasObject!.rooms[this.draggedRoomIndex];

      // Calculate the new position of the dragged room
      const newRoomX = draggedRoom.x + dx;
      const newRoomY = draggedRoom.y + dy;

      // Check if the new position is within the canvas boundaries
      if (
        newRoomX >= 0 &&
        newRoomX + draggedRoom.width <= this.CANVAS_WIDTH &&
        newRoomY >= 0 &&
        newRoomY + draggedRoom.height <= this.CANVAS_HEIGHT
      ) {
        draggedRoom.x = newRoomX;
        draggedRoom.y = newRoomY;

        // Move the doors
        for (const draggedDoor of this.draggedDoors) {
          draggedDoor.x += dx;
          draggedDoor.y += dy;
        }

        this.dragStartX = x;
        this.dragStartY = y;

        this.drawObject();
      }
    }
  }

  @HostListener('window:mouseup', ['$event'])
  @HostListener('window:touchend', ['$event'])
  onDragEnd(event: any) {
    if (!this._canvasObject || this.hideForm) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let x: number = 0;
    let y: number = 0;
    if (event instanceof MouseEvent) {
      // Mouse event
      x = event.clientX;
      y = event.clientY;
    } else if (event instanceof TouchEvent) {
      // Touch event
      const touch = event.touches[0];
      x = touch.clientX;
      y = touch.clientY;
    }
    x = (x - rect.left) * scaleX;
    y = (y - rect.top) * scaleY;

    if (x < 0 || x > this.CANVAS_WIDTH || y < 0 || y > this.CANVAS_HEIGHT) {
      return;
    }

    clearTimeout(this.clickTimeout);

    this.isDragging = false;
    this.draggedRoomIndex = -1;
    this.draggedDoors = new Set<Door>();
    this.selectedRoom = undefined;
    this.drawObject();
  }

  changeMode(addDoor: boolean): void {
    if (addDoor) {
      this.modeAddRoom = false;
    } else {
      this.modeAddDoor = false;
    }
    this.drawObject();
  }

  drawObject() {
    if (!this.ctx) {
      return;
    }

    // Clear the canvas
    this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

    if (!this._canvasObject) {
      return;
    }

    let object = this._canvasObject;

    // Draw the rooms
    for (let room of object.rooms) {
      if (room === this.selectedRoom) {
        continue;
      }
      this.drawRoom(room);
    }

    // Draw doors on top
    for (let room of object.rooms) {
      if (room === this.selectedRoom) {
        continue;
      }
      this.drawDoors(room);
    }

    if (this.selectedRoom !== undefined) {
      this.drawRoom(this.selectedRoom);
      this.drawDoors(this.selectedRoom);
    }
  }

  drawRoom(room: Room) {
    if (!this._canvasObject || !this.ctx) {
      return;
    }

    let object = this._canvasObject;

    this.ctx.strokeStyle = 'gray';
    this.ctx.lineWidth = room.borderSize;
    this.ctx.strokeRect(room.x, room.y, room.width, room.height);

    switch (room.roomState) {
      case 'working':
        this.ctx.fillStyle = '#FF8A8A';
        break;
      case 'finished':
        this.ctx.fillStyle = 'lightgreen';
        break;
      case 'invalid':
        this.ctx.fillStyle = '#FFFF9F';
        break;
      default:
        this.ctx.fillStyle = 'white';
        break;
    }
    this.ctx.fillRect(room.x, room.y, room.width, room.height);

    if (room === this.selectedRoom) {
      this.ctx.fillStyle = 'skyblue';
      this.ctx.fillRect(room.x, room.y, room.width, room.height);
    }
  }

  drawDoors(room: Room) {
    if (!this._canvasObject || !this.ctx) {
      return;
    }

    let object = this._canvasObject;

    // Draw the doors in each room
    if (!room.doors) {
      return;
    }
    for (let door of room.doors) {
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = 'black';
      this.ctx.strokeRect(door.x, door.y, door.width, door.height);

      if (door === this.selectedDoor) {
        // lighter brown
        this.ctx.fillStyle = '#C4A484';
      } else {
        this.ctx.fillStyle = 'brown';
      }
      this.ctx.fillRect(door.x, door.y, door.width, door.height);
    }
  }

  private selectRoom(x: number, y: number, object: CanvasObject) {
    for (let i = 0; i < object.rooms.length; i++) {
      const room = object.rooms[i];
      if (
        x >= room.x &&
        x <= room.x + room.width &&
        y >= room.y &&
        y <= room.y + room.height
      ) {
        this.selectedDoor = undefined;
        this.selectedRoom = room;
        return;
      }
    }
    this.selectedRoom = undefined;
  }

  private selectDoor(x: number, y: number, object: CanvasObject) {
    for (let i = 0; i < object.doors.length; i++) {
      const door = object.doors[i];
      if (
        x >= door.x &&
        x <= door.x + door.width &&
        y >= door.y &&
        y <= door.y + door.height
      ) {
        this.selectedRoom = undefined;
        this.selectedDoor = door;
        return;
      }
    }
    this.selectedDoor = undefined;
  }

  private addRoom(x: number, y: number, object: CanvasObject) {
    if (
      this.newRoomWidth <= 0 ||
      this.newRoomHeight <= 0 ||
      y + this.newRoomHeight > this.CANVAS_HEIGHT ||
      x + this.newRoomWidth > this.CANVAS_WIDTH
    ) {
      this.toastr.error('Unesite validne dimenzije i poziciju');
      return;
    }
    const room: Room = new Room();
    room.x = x;
    room.y = y;
    room.width = this.newRoomWidth;
    room.height = this.newRoomHeight;

    this.selectedDoor = undefined;
    this.selectedRoom = undefined;

    object.rooms.push(room);
  }

  private addDoor(x: number, y: number, object: CanvasObject) {
    let door = new Door();
    door.x = x - door.width / 2;
    door.y = y - door.height / 2;

    let foundRoom: boolean = false;

    for (let room of object.rooms) {
      if (this.canvasValidateService.doorOnLeftOrRightBorder(room, door)) {
        door.height = this.MAX_DOOR_WIDTH;
        foundRoom = true;
      }
      if (this.canvasValidateService.doorOnTopOrBottomBorder(room, door)) {
        door.width = this.MAX_DOOR_WIDTH;
        foundRoom = true;
      }
      if (foundRoom) {
        room.doors?.add(door);
        break;
      }
    }

    if (!foundRoom) {
      this.toastr.error('Vrata moraju biti na granici sobe');
      return;
    }

    this.selectedDoor = undefined;
    this.selectedRoom = undefined;

    object.doors.push(door);
  }
}
