import { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Login - GrihaBhoomi",
  description: "Sign in to manage your properties and listings",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
