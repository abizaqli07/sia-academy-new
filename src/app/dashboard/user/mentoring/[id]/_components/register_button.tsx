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
import { UploadDropzone } from "~/lib/uploadthing";
import { cn } from "~/lib/utils";
import { RegisterUserDataMentoringSchema } from "~/server/validator/mentoring";
import { api, type RouterOutputs } from "~/trpc/react";

const objectives = [
  { label: "Job Hunting", value: "Job Hunting" },
  { label: "Career Planning", value: "Career Planning" },
  { label: "Scholarship Guidance", value: "Scholarship Guidance" },
  { label: "Personal Development", value: "Personal Development" },
] as const;

interface RegisterButtonPropsInterface {
  data: RouterOutputs["userRoute"]["mentoring"]["getOneMentoring"];
}

const RegisterButton = ({ data }: RegisterButtonPropsInterface) => {
  const router = useRouter();

  const createInvoice = api.userRoute.purchase.purchaseMentoring.useMutation({
    onSuccess(data) {
      if (data.url === null) {
        console.log(data.error);
      } else {
        router.push(data.url);
      }

      // router.push(data);
    },
    onError(error) {
      toast(error.data?.code, {
        description: error.message,
      });
    },
  });

  const form = useForm<z.infer<typeof RegisterUserDataMentoringSchema>>({
    resolver: zodResolver(RegisterUserDataMentoringSchema),
    defaultValues: {
      objective: "",
      preference: "",
      positionPreference: "",
      referral: "",
      cv: "https://2z397myec4.ufs.sh/f/Ny1CT1n4jDEIxqBpuEPwgTb0XslmPB4C3QSeyzduNMtDaoR7",
      mentoringId: data?.id,
    },
  });

  const onSubmit = (
    values: z.infer<typeof RegisterUserDataMentoringSchema>,
  ) => {
    createInvoice.mutate(values);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Daftar Sekarang</Button>
        </DialogTrigger>
        <DialogContent className="scrollbar-hide max-h-[90vh] overflow-auto overflow-y-scroll sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Daftar Mentoring</DialogTitle>
            <DialogDescription>Daftar mentoring sekarang.</DialogDescription>
          </DialogHeader>
          {/* Banner */}
          <div className="aspect-[3/1] w-full rounded-xl bg-gray-200"></div>

          {/* Forms Registration */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="referral"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Referral</FormLabel>
                    <FormControl>
                      <Input placeholder="Kode referral" {...field} />
                    </FormControl>
                    <FormDescription>
                      Kode referral untuk mentoring ini (Kosongi jika tidak ada)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="objective"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Objective</FormLabel>
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
                              ? objectives.find(
                                  (objective) =>
                                    objective.value === field.value,
                                )?.label
                              : "Select objective"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search objective..." />
                          <CommandEmpty>No objective found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {objectives.map((objective) => (
                                <CommandItem
                                  value={objective.label}
                                  key={objective.value}
                                  onSelect={() => {
                                    form.setValue("objective", objective.value);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      objective.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {objective.label}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This is the objective that will be used in the dashboard.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minat Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="Your preference" {...field} />
                    </FormControl>
                    <FormDescription>
                      Ex : Manufaktur, Hospitality, FMCG, dll (Kosongi jika
                      belum yakin)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="positionPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferensi Posisi</FormLabel>
                    <FormControl>
                      <Input placeholder="Your preference" {...field} />
                    </FormControl>
                    <FormDescription>
                      Ex : HR, Manager, dll (Kosongi jika belum yakin)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cv"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload Your CV</FormLabel>
                    <FormControl>
                      <UploadDropzone
                        className="ut-button:bg-primary ut-button:px-2 ut-label:text-primary"
                        endpoint="userMentoringCv"
                        onClientUploadComplete={(res) => {
                          toast("Upload Complete", {
                            description: "CV successfully uploaded",
                          });

                          form.setValue("cv", res[0]?.ufsUrl ?? "");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit & Continue to checkout</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterButton;
