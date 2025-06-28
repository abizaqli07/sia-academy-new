"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RegisterSchema } from "~/server/validator/auth";
import { api } from "~/trpc/react";

const Register = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("redirect");

  const register = api.authRoute.register.useMutation({
    async onSuccess(data, variables) {
      await signIn("credentials", {
        email: variables.email,
        password: variables.password,
        redirect: false,
      }).then((callback) => {
        if (callback?.error) {
          toast("Something went wrong", {
            description: callback.error,
          });
        }

        if (callback?.ok && !callback.error) {
          router.push(`${search ?? "/redirect"}`);
        }
      });
    },
    onError(error) {
      toast("Something went wrong", {
        description: error.message,
      });
    },
  });

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    register.mutate(values);
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="bg-primary relative hidden flex-1 md:flex">
        <Image
          src={"/images/auth/auth_bg_2.jpg"}
          alt="Background"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Image
              className="mx-auto dark:invert"
              src="/logo.png"
              alt="Linkup"
              width={150}
              height={150}
            />
            {/* <div className="text-center text-3xl font-bold">SIA Academy</div> */}
            <h2 className="mt-10 text-center text-2xl leading-9 font-bold tracking-tight text-gray-900 dark:text-gray-300">
              Buat akun anda
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama anda" {...field} />
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
                        <FormLabel>Alamat Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email anda"
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
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
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Konfirmasi password"
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
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/80 focus-visible:outline-primary flex w-full justify-center rounded-md px-3 py-1.5 text-sm leading-6 font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </Form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Sudah memiliki akun?{" "}
              <Link
                href={`/auth/signin${search !== null ? "?redirect=" + search : ""}`}
                className="text-primary hover:text-primary/80 leading-6 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
