import { Injectable } from '@angular/core';
import User from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ValidateService {
  constructor() {}

  validateRequired(user: User): boolean {
    if (
      user.username.trim() === '' ||
      user.password?.trim() === '' ||
      user.email.trim() === '' ||
      user.phone.trim() === '' ||
      user.userType.trim() === ''
    ) {
      return false;
    }
    switch (user.userType) {
      case 'client':
        if (
          user.clientInfo?.firstName.trim() === '' ||
          user.clientInfo?.lastName.trim() === ''
        ) {
          return false;
        } else {
          return true;
        }
      case 'agency':
        if (
          user.agencyInfo?.agencyName.trim() === '' ||
          user.agencyInfo?.country.trim() === '' ||
          user.agencyInfo?.city.trim() === '' ||
          user.agencyInfo?.street.trim() === '' ||
          user.agencyInfo?.registrationNumber.trim() === '' ||
          user.agencyInfo?.description.trim() === ''
        ) {
          return false;
        } else {
          return true;
        }
      case 'admin':
        return true;
    }
    return false;
  }

  validatePhone(phone: string): boolean {
    const expression: RegExp = /^(\+|0)381\s?[6-7][0-9]{2}\s?[0-9]{6,7}$/;

    const result: boolean = expression.test(phone);

    return result;
  }

  validateEmail(email: string): boolean {
    const expression: RegExp =
      /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

    const result: boolean = expression.test(email);

    return result;
  }

  validateRegistrationNumber(registrationNumber: string): boolean {
    const expression: RegExp = /^[0-9]{6,}$/;

    const result: boolean = expression.test(registrationNumber);

    return result;
  }

  validatePasswordMatch(pass1: string, pass2: string): boolean {
    return pass1 === pass2;
  }

  validatePassword(password: string): boolean {
    const expression: RegExp =
      /^(?=.*[A-Z])(?=.*\W)(?=.*[0-9])[a-zA-Z].{6,11}$/;

    const result: boolean = expression.test(password);

    return result;
  }

  async validateImgSize(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const minSize = 100;
      const maxSize = 300;
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = reader.result as string;
        image.onload = () => {
          const width = image.width;
          const height = image.height;
          if (
            width < minSize ||
            height < minSize ||
            width > maxSize ||
            height > maxSize
          ) {
            resolve(false);
          } else {
            resolve(true);
          }
        };
      };

      reader.onerror = () => {
        reject('Neuspesno ucitavanje slike');
      };

      reader.readAsDataURL(file);
    });
  }

  validateFileIsImage(file: File): boolean {
    return file.type === 'image/jpeg' || file.type === 'image/png';
  }
}
