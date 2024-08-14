export default interface User {
  role: "root" | "admin" | "analyzer";
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  id: number;
}
