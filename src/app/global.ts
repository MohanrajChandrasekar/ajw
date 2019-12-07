// globals.ts
import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  role: string = 'test';
  userRole: string;
  canEditFailure: Boolean = false;
  loginID: string;
  branchId: number;
}

export const TextConstants = {
  errorHandle: "Unable to process the request. Contact the administrator",
  saveSuccess: 'Saved Successfully!',
  editSuccess: 'Updated Successfully!'
}
