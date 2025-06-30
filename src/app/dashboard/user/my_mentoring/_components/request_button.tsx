"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Preview } from "~/components/ui/preview";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import { RequestSessionSchema } from "~/server/validator/mentoring";
import { api, type RouterOutputs } from "~/trpc/react";

const RequestButton = ({
  mentoringDataId,
  schedules,
}: {
  mentoringDataId: string;
  schedules: RouterOutputs["userRoute"]["mentoring"]["getRecentSession"];
}) => {
  const context = api.useUtils()
  const requestSession = api.userRoute.mentoring.requestSession.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Success requesting session",
      });
      await context.userRoute.mentoring.getRecentSession.invalidate()
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

  const form = useForm<z.infer<typeof RequestSessionSchema>>({
    resolver: zodResolver(RequestSessionSchema),
    defaultValues: {
      mentoringDataId: mentoringDataId,
      date: new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof RequestSessionSchema>) => {
    requestSession.mutate(values);
  };

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      form.setValue("date", date);
    }
  }

  function handleTimeChange(type: "hour" | "minute", value: string) {
    const currentDate = form.getValues("date") ?? new Date();
    const newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    }

    form.setValue("date", newDate);
  }

  const recentSchedule = schedules?.schedules;
  let isAlreadyRequest;

  if (recentSchedule === undefined) {
    isAlreadyRequest = false;
  } else if (recentSchedule.length > 0) {
    isAlreadyRequest = true;
  } else {
    isAlreadyRequest = false;
  }

  if (isAlreadyRequest && recentSchedule![0]?.status === "ACCEPTED") {
    return (
      <>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Session Accepted</Button>
          </DialogTrigger>
          <DialogContent className="scrollbar-hide max-h-[90vh] overflow-auto overflow-y-scroll sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Request Session</DialogTitle>
              <DialogDescription>Minta sesi mentoringmu</DialogDescription>
            </DialogHeader>

            {/* Content */}
            <div className="mt-2 text-sm text-slate-500 italic">
              <Preview value={recentSchedule![0].message ?? ""} />
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (isAlreadyRequest && recentSchedule![0]?.status === "DENIED") {
    return (
      <>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Request Session Again</Button>
          </DialogTrigger>
          <DialogContent className="scrollbar-hide max-h-[90vh] overflow-auto overflow-y-scroll sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Request Session</DialogTitle>
              <DialogDescription>Minta sesi mentoringmu</DialogDescription>
            </DialogHeader>
            {/* Banner */}
            <div className="aspect-[3/1] w-full rounded-xl bg-gray-200"></div>

            {/* Forms Registration */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Date Form */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Course Date (optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "MM/dd/yyyy HH:mm")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <div className="sm:flex">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={handleDateSelect}
                              initialFocus
                            />
                            <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
                              <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex p-2 sm:flex-col">
                                  {Array.from({ length: 24 }, (_, i) => i)
                                    .reverse()
                                    .map((hour) => (
                                      <Button
                                        key={hour}
                                        size="icon"
                                        variant={
                                          field.value &&
                                          field.value.getHours() === hour
                                            ? "default"
                                            : "ghost"
                                        }
                                        className="aspect-square shrink-0 sm:w-full"
                                        onClick={() =>
                                          handleTimeChange(
                                            "hour",
                                            hour.toString(),
                                          )
                                        }
                                      >
                                        {hour}
                                      </Button>
                                    ))}
                                </div>
                                <ScrollBar
                                  orientation="horizontal"
                                  className="sm:hidden"
                                />
                              </ScrollArea>
                              <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex p-2 sm:flex-col">
                                  {Array.from(
                                    { length: 12 },
                                    (_, i) => i * 5,
                                  ).map((minute) => (
                                    <Button
                                      key={minute}
                                      size="icon"
                                      variant={
                                        field.value &&
                                        field.value.getMinutes() === minute
                                          ? "default"
                                          : "ghost"
                                      }
                                      className="aspect-square shrink-0 sm:w-full"
                                      onClick={() =>
                                        handleTimeChange(
                                          "minute",
                                          minute.toString(),
                                        )
                                      }
                                    >
                                      {minute.toString().padStart(2, "0")}
                                    </Button>
                                  ))}
                                </div>
                                <ScrollBar
                                  orientation="horizontal"
                                  className="sm:hidden"
                                />
                              </ScrollArea>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Your request date for mentoring session
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Request</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (isAlreadyRequest && recentSchedule![0]?.status === "PENDING") {
    return (
      <Button variant="outline" disabled>
        Pending
      </Button>
    );
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">Request Session</Button>
        </DialogTrigger>
        <DialogContent className="scrollbar-hide max-h-[90vh] overflow-auto overflow-y-scroll sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Session</DialogTitle>
            <DialogDescription>Minta sesi mentoringmu</DialogDescription>
          </DialogHeader>
          {/* Banner */}
          <div className="aspect-[3/1] w-full rounded-xl bg-gray-200"></div>

          {/* Forms Registration */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Date Form */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Course Date (optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "MM/dd/yyyy HH:mm")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <div className="sm:flex">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={handleDateSelect}
                            initialFocus
                          />
                          <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
                            <ScrollArea className="w-64 sm:w-auto">
                              <div className="flex p-2 sm:flex-col">
                                {Array.from({ length: 24 }, (_, i) => i)
                                  .reverse()
                                  .map((hour) => (
                                    <Button
                                      key={hour}
                                      size="icon"
                                      variant={
                                        field.value &&
                                        field.value.getHours() === hour
                                          ? "default"
                                          : "ghost"
                                      }
                                      className="aspect-square shrink-0 sm:w-full"
                                      onClick={() =>
                                        handleTimeChange(
                                          "hour",
                                          hour.toString(),
                                        )
                                      }
                                    >
                                      {hour}
                                    </Button>
                                  ))}
                              </div>
                              <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                              />
                            </ScrollArea>
                            <ScrollArea className="w-64 sm:w-auto">
                              <div className="flex p-2 sm:flex-col">
                                {Array.from(
                                  { length: 12 },
                                  (_, i) => i * 5,
                                ).map((minute) => (
                                  <Button
                                    key={minute}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      field.value.getMinutes() === minute
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="aspect-square shrink-0 sm:w-full"
                                    onClick={() =>
                                      handleTimeChange(
                                        "minute",
                                        minute.toString(),
                                      )
                                    }
                                  >
                                    {minute.toString().padStart(2, "0")}
                                  </Button>
                                ))}
                              </div>
                              <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                              />
                            </ScrollArea>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Your request date for mentoring session
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Request</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RequestButton;
