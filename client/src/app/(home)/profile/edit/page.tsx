"use client";

import Link from "next/link";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext";
import EditProfileForm from "./_components/edit-profile-form";
import { Icons } from "@/components/icons";

export default function EditProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Shell>
        <p role="status">Loading your profile!</p>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell className="pb-12 md:pb-14 bg-slate-50 dark:bg-transparent/5">
        <div className="container max-w-4xl py-6 lg:py-10">
          <p>Please sign in to edit your profile.</p>
          {/* Similar in style of the sign in button in login page but here, we are using Link component */}
          <Button className="w-full font-medium tracking-wide group" asChild>
            <Link href="/login?redirect=%2Fprofile%2Fedit">
              Sign in
              <Icons.rightArrow
                className="ml-1 size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell className="pb-12 md:pb-14 bg-slate-50 dark:bg-transparent/5">
      <div className="container max-w-3xl py-6 lg:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit profile</h1>
          <p className="mt-2 text-muted-foreground">
            Update your personal details and profile picture.
          </p>
        </div>

        <EditProfileForm key={user.id} user={user} />
      </div>
    </Shell>
  );
}
