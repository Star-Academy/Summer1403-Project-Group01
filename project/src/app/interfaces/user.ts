export enum accessPoints {
  systemRoot,
  dataAdmin,
  analyzer
}

export default interface User {
  access: accessPoints;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  id: number;
}
