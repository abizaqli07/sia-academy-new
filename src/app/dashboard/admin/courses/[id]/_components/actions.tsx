"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const context = api.useUtils();

  const pub = api.adminRoute.course.publish.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Course Published",
      });
      await context.adminRoute.course.getOne.invalidate();
      setIsLoading(false);
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const unPub = api.adminRoute.course.unpublish.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Course Unpublished",
      });
      await context.adminRoute.course.getOne.invalidate();
      setIsLoading(false);
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const onClick = async () => {
    setIsLoading(true);

    if (isPublished) {
      unPub.mutate({
        courseId: courseId,
      });
    } else {
      pub.mutate({
        courseId: courseId,
      });
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
    </div>
  );
};
