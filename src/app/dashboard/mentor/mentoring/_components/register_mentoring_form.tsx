"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Editor } from "~/components/ui/editor";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { RegisterMentoringSchema } from "~/server/validator/mentoring";
import { api, type RouterOutputs } from "~/trpc/react";

interface RegisterMentoringInterface {
  categories: RouterOutputs["mentorRoute"]["mentoring"]["getCategory"];
}

const RegisterMentoringForm = ({ categories }: RegisterMentoringInterface) => {
  const router = useRouter();

  const registerMentoring =
    api.mentorRoute.mentoring.registerMentoring.useMutation({
      onSuccess() {
        toast("Success", {
          description: "Mentoring Register Succesfully",
        });
        router.refresh();
      },
      onError(error) {
        toast("Failed", {
          description: error.message,
        });
      },
    });

  const form = useForm<z.infer<typeof RegisterMentoringSchema>>({
    resolver: zodResolver(RegisterMentoringSchema),
    defaultValues: {
      categoryId: "",
      title: "",
      materi: "",
      price: "0",
      desc: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = (values: z.infer<typeof RegisterMentoringSchema>) => {
    registerMentoring.mutate(values);
  };

  return (
    <ScrollArea className="h-full w-full">
      <div className="mx-auto flex h-full max-w-5xl p-4 md:items-center md:justify-center lg:px-6">
        <div>
          <h1 className="text-2xl">Daftarkan mentoring anda</h1>
          <p className="text-sm text-slate-600">
            Daftarkan mentoringmu segera untuk dapat membuka ruang bagi ribuan
            mentee yang ingin berkarir.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8 space-y-8"
            >
              {/* ============= Title ============ */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Mentoring</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'Mentoring Karir Website Developer'"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Tentang apa mentoring yang akan anda buat?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ============ Desc =============  */}
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Editor {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ============ Materi =============  */}
              <FormField
                control={form.control}
                name="materi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Materi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Pembuatan CV,Perusahaan Terbaik di Jenjang Karir"
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Materi yang ingin anda ajarkan di sesi mentoring anda.
                      Pisahkan dengan tanda koma (,).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ============= Price ============ */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isSubmitting}
                        placeholder="Price"
                        min={1000}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Harga untuk sesi mentoring anda.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Kategori</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? categories.find(
                                  (category) => category.id === field.value,
                                )?.name
                              : "Select category"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search category..." />
                          <CommandList>
                            <CommandEmpty>
                              Tidak ada kategori yang ditemukan.
                            </CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  value={category.name ?? ""}
                                  key={category.id}
                                  onSelect={() => {
                                    form.setValue("categoryId", category.id);
                                  }}
                                >
                                  {category.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      category.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Kategori untuk mentoring anda
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-x-2">
                <Button
                  onClick={() => router.push("/dashboard/mentor/")}
                  type="button"
                  variant="ghost"
                >
                  Batalkan
                </Button>

                <Button type="submit" disabled={!isValid || isSubmitting}>
                  Daftar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </ScrollArea>
  );
};

export default RegisterMentoringForm;
