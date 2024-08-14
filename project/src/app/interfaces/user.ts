export default interface User {
  role?: "admin" | "dataadmin" | "dataanalyst";
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}
