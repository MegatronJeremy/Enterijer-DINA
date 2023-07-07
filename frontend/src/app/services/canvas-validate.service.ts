import { Injectable } from '@angular/core';
import CanvasObject, { Door, Room } from '../models/canvasObject';

@Injectable({
  providedIn: 'root',
})
export class CanvasValidateService {
  constructor() {}

  validateCanvasObject(obj: CanvasObject): void {
    if (obj.type.trim() === '') {
      throw new Error('Izaberite tip objekta');
    }

    if (obj.address.trim() === '') {
      throw new Error('Unesite adresu');
    }

    if (obj.roomNum <= 0 || obj.roomNum > 3) {
      throw new Error('Unesite broj prostorija izmedju 1 i 3');
    }

    if (obj.roomNum > obj.rooms.length) {
      throw new Error('Unesite sve prostorije na skici');
    }

    if (obj.roomNum < obj.rooms.length) {
      throw new Error('Uneli ste više prostorija od zadatog broja');
    }

    if (obj.area <= 0) {
      throw new Error('Unesite površinu vecu od 0');
    }

    for (let room1 of obj.rooms) {
      for (let room2 of obj.rooms) {
        if (room1 !== room2) {
          if (this.isRoomOverlap(room1, room2)) {
            throw new Error('Sobe se preklapaju');
          }
        }
      }
    }

    for (let door1 of obj.doors) {
      for (let door2 of obj.doors) {
        if (door1 !== door2) {
          if (this.isDoorOverlap(door1, door2)) {
            throw new Error('Vrata se preklapaju');
          }
        }
      }
    }

    if (obj.rooms.length > 1) {
      for (let room1 of obj.rooms) {
        let touchesRoom = false;
        for (let room2 of obj.rooms) {
          if (room1 !== room2 && this.roomsTouching(room1, room2)) {
            touchesRoom = true;
            break;
          }
        }
        if (!touchesRoom) {
          throw new Error('Sobe se ne dodiruju');
        }
      }
    }

    for (let room of obj.rooms) {
      let hasDoor = false;
      for (let door of obj.doors) {
        if (this.doorOnBorder(room, door)) {
          hasDoor = true;
          break;
        }
      }
      if (!hasDoor) {
        throw new Error('Soba nema vrata');
      }
    }
  }

  private isRoomOverlap(room1: Room, room2: Room): boolean {
    return (
      room1.x + room1.borderSize < room2.x + room2.width - room2.borderSize &&
      room1.x + room1.width - room1.borderSize > room2.x + room2.borderSize &&
      room1.y + room1.borderSize < room2.y + room2.height - room2.borderSize &&
      room1.y + room1.height - room1.borderSize > room2.y + room2.borderSize
    );
  }

  private isDoorOverlap(door1: Door, door2: Door): boolean {
    return (
      door1.x < door2.x + door2.width &&
      door1.x + door1.width > door2.x &&
      door1.y < door2.y + door2.height &&
      door1.y + door1.height > door2.y
    );
  }

  doorOnBorder(room: Room, door: Door): boolean {
    return (
      this.doorOnLeftOrRightBorder(room, door) ||
      this.doorOnTopOrBottomBorder(room, door)
    );
  }

  doorOnLeftOrRightBorder(room: Room, door: Door) {
    return (
      ((door.x + door.width >= room.x + room.borderSize &&
        door.x <= room.x - room.borderSize) ||
        (door.x + door.width >= room.x + room.width - room.borderSize &&
          door.x <= room.x + room.width + room.borderSize)) &&
      door.y >= room.y - room.borderSize &&
      door.y + door.height <= room.y + room.height + room.borderSize
    );
  }

  doorOnTopOrBottomBorder(room: Room, door: Door) {
    return (
      ((door.y + door.height >= room.y + room.borderSize &&
        door.y <= room.y - room.borderSize) ||
        (door.y + door.height >= room.y + room.height - room.borderSize &&
          door.y <= room.y + room.height + room.borderSize)) &&
      door.x >= room.x - room.borderSize &&
      door.x + door.width <= room.x + room.width + room.borderSize
    );
  }

  private roomsTouching(room1: Room, room2: Room): boolean {
    const borderSize = (room1.borderSize + room2.borderSize) / 2;
    return (
      (room1.x + room1.width >= room2.x - borderSize &&
        room1.x + room1.width <= room2.x + borderSize) ||
      (room1.x >= room2.x + room2.width - borderSize &&
        room1.x <= room2.x + room2.width + borderSize) ||
      (room1.y + room1.height >= room2.y - borderSize &&
        room1.y + room1.height <= room2.y + borderSize) ||
      (room1.y >= room2.y + room2.height - borderSize &&
        room1.y <= room2.y + room2.height + borderSize)
    );
  }
}
