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
import { LoginSchema } from "~/server/validator/auth";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("redirect");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    await signIn("credentials", {
      ...values,
      redirect: false,
    }).then((callback) => {
      if (callback?.error) {
        if (callback.code === "NotFound") {
          toast("Login Failed", {
            description: "User dengan email ini tidak ditemukan",
          });
        }
        if (callback.code === "NotConfigured") {
          toast("Login Failed", {
            description: "Password belum dikonfigurasi",
          });
        }
        if (callback.code === "NotMatch") {
          toast("Login Failed", {
            description: "Password salah",
          });
        }
        if (callback.code === "Other") {
          toast("Login Failed", {
            description: "Terjadi kesalahan di server",
          });
        }
      }

      if (callback?.ok && !callback.error) {
        router.push(`${search ?? "/redirect"}`);
      }
    });
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
        <div className="flex min-h-full w-full max-w-[600px] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
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
              Masuk ke akun anda
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
                  <Link
                    href={"/auth/forgot_password"}
                    className="mt-1 text-sm text-gray-700"
                  >
                    Lupa password?
                  </Link>
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/80 focus-visible:outline-primary flex w-full justify-center rounded-md px-3 py-1.5 text-sm leading-6 font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </Form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Belum terdaftar?{" "}
              <Link
                href={`/auth/signup${search !== null ? "?redirect=" + search : ""}`}
                className="text-primary hover:text-primary leading-6 font-semibold"
              >
                Mulai perjalanan karirmu
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
