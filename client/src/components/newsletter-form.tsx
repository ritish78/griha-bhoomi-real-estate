"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { unknownError } from "@/lib/constants";
import { emailSchema, type EmailSchema } from "@/lib/validation/notification";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";

export function NewsletterForm() {
  const [loading, setLoading] = React.useState(false);

  // react-hook-form
  const form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ""
    }
  });

  async function onSubmit(data: EmailSchema) {
    setLoading(true);
    try {
      //TODO:
      //SET the email to be in the database
      //If the email exists, then provide toast accordingly
    } catch (err) {
      console.log(err);
      toast.error(unknownError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form className="grid w-full" onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative space-y-0">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input placeholder="your-email@gmail.com" className="pr-12" {...field} />
              </FormControl>
              <FormMessage />
              <Button className="absolute right-[3.5px] top-[4px] z-20 size-7" size="icon" disabled={loading}>
                {loading ? (
                  <Icons.spinner className="size-3 animate-spin" aria-hidden="true" />
                ) : (
                  <PaperPlaneIcon className="size-3" aria-hidden="true" />
                )}
                <span className="sr-only">Join Newsletter</span>
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
