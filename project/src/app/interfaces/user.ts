export default interface User {
  role?: "admin" | "dataadmin" | "dataanalyst";
  email?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}
