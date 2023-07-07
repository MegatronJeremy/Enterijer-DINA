export default class User {
  _id: string = '';
  username: string = '';
  password?: string = '';
  phone: string = '';
  email: string = '';
  profilePicture?: File;
  clientInfo?: {
    firstName: string;
    lastName: string;
  };
  agencyInfo?: {
    agencyName: string;
    country: string;
    city: string;
    street: string;
    registrationNumber: string;
    description: string;
  };
  userType: string = '';
  registered: boolean = false;
}
