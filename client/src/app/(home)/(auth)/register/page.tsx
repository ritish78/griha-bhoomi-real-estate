import { Metadata } from "next";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "Register - GrihaBhoomi",
  description: "Create an account to start listing properties",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
