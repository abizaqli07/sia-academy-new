"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { signIn } from "next-auth/react";
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
import { Editor } from "~/components/ui/editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { ResponseSessionSchema } from "~/server/validator/mentoring";
import { api } from "~/trpc/react";

const AcceptButton = ({
  scheduleId,
  message,
}: {
  scheduleId: string;
  message: string;
}) => {
  const context = api.useUtils();
  const requestSession = api.mentorRoute.mentee.responseSession.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Success accepting session",
      });
      await context.mentorRoute.mentee.getOne.invalidate();
    },
    onError(error) {
      if (error.data?.code === "FORBIDDEN") {
        signIn().catch((err) => {
          console.log(err);
        });
      } else {
        toast(error.data?.code, {
          description: error.message,
        });
      }
    },
  });

  const form = useForm<z.infer<typeof ResponseSessionSchema>>({
    resolver: zodResolver(ResponseSessionSchema),
    defaultValues: {
      id: scheduleId,
      message: message,
      status: "ACCEPTED",
    },
  });

  const onSubmit = (values: z.infer<typeof ResponseSessionSchema>) => {
    requestSession.mutate(values);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="hover:bg-accent relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none">
            <Pencil className="mr-2 h-4 w-4" />
            Accept
          </div>
        </DialogTrigger>
        <DialogContent className="scrollbar-hide max-h-[90vh] overflow-auto overflow-y-scroll sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Response Session</DialogTitle>
            <DialogDescription>
              Response sesi mentoring dari user
            </DialogDescription>
          </DialogHeader>
          {/* Banner */}
          <div className="aspect-[3/1] w-full rounded-xl bg-gray-200"></div>

          {/* Forms Registration */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Message Form */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Accept</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AcceptButton;
