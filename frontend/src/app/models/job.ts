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

  static getJobStatus(job: Job) {
    switch (job.status) {
      case 'created':
        return 'Napravljen';
      case 'rejected':
        return 'Odbijen';
      case 'pending':
        return 'Na čekanju';
      case 'active':
        return 'Aktivan';
      case 'completed':
        return 'Završen';
      default:
        return 'Nepoznato';
    }
  }
}
