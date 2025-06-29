"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

const DeleteButton = ({ courseId }: { courseId: string }) => {
  const context = api.useUtils();

  const deleteCourse = api.adminRoute.course.delete.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Course Deleted",
      });
      await context.adminRoute.course.getAll.invalidate();
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
    },
  });

  const onSubmit = (values: { courseId: string }) => {
    deleteCourse.mutate(values);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="text-destructive hover:bg-accent relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </div>
        </DialogTrigger>
        <DialogContent className="scrollbar-hide max-h-[90vh] overflow-auto overflow-y-scroll sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure want to delete this course?
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              className="w-fit justify-self-end"
              onClick={() => onSubmit({ courseId: courseId })}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteButton;
