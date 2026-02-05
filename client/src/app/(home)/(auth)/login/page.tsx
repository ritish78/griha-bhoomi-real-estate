import { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Login - GrihaBhoomi",
  description: "Sign in to manage your properties and listings",
};

export default function LoginPage() {
  return <LoginForm />;
}
