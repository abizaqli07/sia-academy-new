"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ChangePasswordSchema } from "~/server/validator/auth";
import { api } from "~/trpc/react";

const ChangePassword = () => {
  const changePw = api.authRoute.changePassword.useMutation({
    onSuccess() {
      toast("Success", {
        description:
          "Password succesfully changed. Please login with new password",
      });
    },
    onError(error) {
      toast(error.data?.code, {
        description: error.message,
      });
    },
  });

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: "",
      oldPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ChangePasswordSchema>) {
    changePw.mutate(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Perbarui Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Perbarui Password</DialogTitle>
          <DialogDescription>
            Buat perubahan sandi anda disini. Tekan simpan jika sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
          >
            <div>
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Lama</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password anda saat ini"
                        autoComplete="current-password"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Baru</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password baru anda"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-5">
              <button
                type="submit"
                className="bg-primary w-full rounded-lg p-2 text-white"
                disabled={changePw.isPending}
              >
                {changePw.isPending ? "Processing.." : "Submit"}
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
