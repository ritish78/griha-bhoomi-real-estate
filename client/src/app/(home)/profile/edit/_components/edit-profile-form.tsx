"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { useAuth, type User } from "@/contexts/authContext";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { profileFormSchema } from "@/lib/profileFormSchema";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import Link from "next/link";

//The account email is displayed in the form but is not submitted for updating.
//Using and() also preserves the password refinements in profileFormSchema.
const editProfileFormSchema = profileFormSchema.and(
  z.object({
    accountEmail: z.string().email()
  })
);

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

export default function EditProfileForm({ user }: { user: User }) {
  const { refreshUser } = useAuth();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const savingRef = useRef(false);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      accountEmail: user.email,
      phone: user.phone ?? "",
      dob: user.dob,
      bio: user.bio ?? "",
      profilePicUrl: user.profilePicUrl ?? "",
      currentPassword: "",
      password: "",
      confirmPassword: ""
    }
  });

  const profilePicUrl = form.watch("profilePicUrl");

  //We preview the selected file locally and release its URL when it changes.
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  async function onSubmit(data: EditProfileFormValues) {
    if (savingRef.current) return;

    savingRef.current = true;
    setIsLoading(true);

    try {
      let savedProfilePicUrl = data.profilePicUrl;

      //We reuse the existing upload helper and save its secure URL.
      //The file is uploaded only when the user submits the form.
      if (selectedFile) {
        //currently, we are just updating the photo to cloudinary.
        //we should also be able to resize it to be smaller as it would
        //increase the load times on every page load
        const uploadedImage = await uploadToCloudinary(selectedFile, "profiles");

        if (!uploadedImage.success || !uploadedImage.url) {
          throw new Error(uploadedImage.error || "Could not upload the profile picture.");
        }

        savedProfilePicUrl = uploadedImage.url;

        //If saving the profile fails, we keep this URL for the next attempt.
        form.setValue("profilePicUrl", savedProfilePicUrl, {
          shouldDirty: true,
          shouldValidate: true
        });
        setSelectedFile(null);
      }

      //We only submit the picture URL when it changes.
      //This also preserves older avatars when updating other details.
      const {
        accountEmail,
        profilePicUrl: originalProfilePicUrl,
        currentPassword,
        password,
        confirmPassword,
        ...profileData
      } = data;

      const wantsToChangePassword = !!currentPassword || !!password || !!confirmPassword;

      const payload = {
        ...profileData,

        //We omit password fields when the user is only updating profile details.
        ...(wantsToChangePassword ? { currentPassword, password, confirmPassword } : {}),

        ...(savedProfilePicUrl !== (user.profilePicUrl ?? "")
          ? { profilePicUrl: savedProfilePicUrl }
          : {})
      };

      const response = await fetch("http://localhost:5000/api/v1/user/update", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.headers.get("content-type")?.includes("json")) {
        throw new Error("Some unexpected error occurred!");
      }

      const body: unknown = await response.json();

      if (!response.ok) {
        const parsedError = z
          .object({
            message: z.string().optional(),
            errors: z.array(z.object({ message: z.string() })).optional()
          })
          .safeParse(body);

        const errorMessage = parsedError.success
          ? parsedError.data.message ||
            parsedError.data.errors?.map((error) => error.message).join(" ")
          : undefined;

        throw new Error(errorMessage || "Could not update your profile!");
      }

      //We retain the saved profile details and clear the password inputs.
      form.reset({
        ...data,
        profilePicUrl: savedProfilePicUrl,
        currentPassword: "",
        password: "",
        confirmPassword: ""
      });

      setShowCurrentPassword(false);
      setShowPassword(false);
      setShowConfirmPassword(false);

      //Refreshing the auth context updates the header's name and avatar too.
      const updatedUser = await refreshUser();

      toast.success("Profile updated", {
        description: updatedUser
          ? "Your changes have been saved."
          : "Saved. Reload to refresh your account details."
      });
    } catch (error) {
      toast.error("Could not update profile", {
        description: error instanceof Error ? error.message : "Please try again later!"
      });
    } finally {
      savingRef.current = false;
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>
        <fieldset disabled={isLoading} className="min-w-0 space-y-8">
          {/* Section 1: Profile Picture */}
          <Card>
            <div className="h-1 w-full bg-primary/80 rounded-t-md" />

            <CardHeader className="space-y-2 my-5 ml-6">
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Choose the photo displayed on your profile and listings.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Avatar className="h-24 w-24 shrink-0">
                  <AvatarImage
                    src={previewUrl || profilePicUrl || undefined}
                    alt="Profile picture preview"
                  />
                  <AvatarFallback>
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <FormField
                  control={form.control}
                  name="profilePicUrl"
                  render={({ field }) => (
                    <FormItem className="w-full min-w-0 flex-1">
                      <FormLabel>Profile picture</FormLabel>

                      <FormControl className="cursor-pointer">
                        <Input
                          ref={field.ref}
                          name={field.name}
                          onBlur={field.onBlur}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            event.target.value = "";

                            if (!file) return;

                            const validTypes = [
                              "image/jpeg",
                              "image/png",
                              "image/webp",
                              "image/gif"
                            ];

                            if (!validTypes.includes(file.type) || file.size > 10 * 1024 * 1024) {
                              toast.error("Choose a JPEG, PNG, WEBP or GIF image up to 10MB.");
                              return;
                            }

                            setSelectedFile(file);
                          }}
                        />
                      </FormControl>

                      <FormDescription>JPEG, PNG, WEBP or GIF, up to 10MB.</FormDescription>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isLoading || (!selectedFile && !profilePicUrl)}
                        onClick={() => {
                          setSelectedFile(null);
                          form.setValue("profilePicUrl", "", {
                            shouldDirty: true,
                            shouldValidate: true
                          });
                        }}
                      >
                        Remove picture
                      </Button>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Personal Information */}
          <Card>
            <div className="h-1 w-full bg-primary/80 rounded-t-md" />

            <CardHeader className="space-y-2 my-5 ml-6">
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your name and contact details.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input autoComplete="given-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input autoComplete="family-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input type="tel" autoComplete="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of birth</FormLabel>
                      <FormControl>
                        {/* TODOD: Need to change the calendar to the one similar to avaliable from in edit/create property page */}
                        <Input type="date" autoComplete="bday" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="accountEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" readOnly disabled={true} {...field} value={user.email} />
                    </FormControl>
                    <FormDescription>
                      The email cannot be changed after creating the profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        ref={field.ref}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        disabled={isLoading}
                        aria-label="Profile bio"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section 3: Change Password */}
          <Card>
            <div className="h-1 w-full bg-primary/80 rounded-t-md" />

            <CardHeader className="space-y-2 my-5 ml-6">
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Leave these fields empty to keep your current password.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>

                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          autoComplete="current-password"
                          className="pr-10"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => setShowCurrentPassword((previous) => !previous)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showCurrentPassword ? "Hide current password" : "Show current password"
                        }
                        aria-pressed={showCurrentPassword}
                      >
                        {showCurrentPassword ? (
                          <Icons.eyeClose className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Icons.eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>

                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            className="pr-10"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>

                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => setShowPassword((previous) => !previous)}
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPassword ? "Hide new password" : "Show new password"}
                          aria-pressed={showPassword}
                        >
                          {showPassword ? (
                            <Icons.eyeClose className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Icons.eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm new password</FormLabel>

                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            className="pr-10"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>

                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => setShowConfirmPassword((previous) => !previous)}
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password confirmation"
                              : "Show password confirmation"
                          }
                          aria-pressed={showConfirmPassword}
                        >
                          {showConfirmPassword ? (
                            <Icons.eyeClose className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Icons.eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col-reverse items-center gap-3 pt-6 sm:flex-row sm:justify-center">
            <Button asChild variant="outline">
              <Link href="/">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Saving changes!" : "Save changes"}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
