import CanvasObject from './canvasObject';
import User from './user';

export default class Job {
  _id: string = '';
  startDate: Date = new Date();
  endDate: Date = new Date();
  status: string = '';
  object?: CanvasObject;
  client?: User;
  agency?: User;
  payOffer?: number;
  cancellationReason?: string;
}
