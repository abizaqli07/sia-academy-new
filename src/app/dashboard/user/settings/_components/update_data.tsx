"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { UploadDropzone } from "~/lib/uploadthing";
import { UpdateDataSchema } from "~/server/validator/auth";
import { api } from "~/trpc/react";
import ChangePassword from "./change_password";

const UpdateData = () => {
  const [data] = api.authRoute.getUserData.useSuspenseQuery();
  const context = api.useUtils();

  const register = api.authRoute.updateUserData.useMutation({
    async onSuccess() {
      await context.authRoute.getUserData.invalidate();
      toast("Update Success", {
        description: "User account successfully updated",
      });
    },
    onError(error) {
      toast(error.data?.code, {
        description: error.message,
      });
    },
  });

  const form = useForm<z.infer<typeof UpdateDataSchema>>({
    resolver: zodResolver(UpdateDataSchema),
    defaultValues: {
      email: data?.email,
      name: data?.name ?? "",
      phone: data?.phone ?? "",
      notifConsent: data?.notifConsent ?? true,
      image: data?.image,
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateDataSchema>) {
    register.mutate(values);
  }

  return (
      <div className="mx-auto w-full space-y-6 md:max-w-lg px-4 lg:px-6">
        <div className="text-xl font-medium md:text-2xl">Pengaturan Akun</div>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
          >
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fullname</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Your phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="notifConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Subscribe SIA Academy</FormLabel>
                      <FormDescription>
                        Dapatkan informasi terbaru mengenai kelas sia academy
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Foto Profile</FormLabel>
                  <FormControl>
                    <UploadDropzone
                      className="ut-button:bg-primary ut-label:text-primary"
                      endpoint="courseImage"
                      onClientUploadComplete={(res) => {
                        toast("Upload Complete", {
                          description: "Profile picture updated",
                        });

                        form.setValue("image", res[0]?.ufsUrl ?? "");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary/80 focus-visible:outline-primary flex w-full justify-center rounded-md px-3 py-1.5 text-sm leading-6 font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Perbarui
              </button>
            </div>
          </form>
        </Form>
        <Separator className="my-4" />
        <ChangePassword />
      </div>
  );
};

export default UpdateData;
