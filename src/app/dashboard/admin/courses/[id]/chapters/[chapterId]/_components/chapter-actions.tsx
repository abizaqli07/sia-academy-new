"use client";

import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ConfirmModal } from "~/components/ui/confirm-modal";
import { api } from "~/trpc/react";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const context = api.useUtils();

  const pub = api.adminRoute.chapter.publish.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Chapter published",
      });
      await context.adminRoute.chapter.getOne.invalidate();
      setIsLoading(false);
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const unPub = api.adminRoute.chapter.unpublish.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Chapter unpublished",
      });
      await context.adminRoute.chapter.getOne.invalidate();
      setIsLoading(false);
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const deleteChapter = api.adminRoute.chapter.delete.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Chapter deleted",
      });
      await context.adminRoute.chapter.getOne.invalidate();
      setIsLoading(false);
      router.push(`/dashboard/admin/courses/${courseId}`)
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
        id: chapterId,
        courseId: courseId,
      });
    } else {
      pub.mutate({
        id: chapterId,
        courseId: courseId,
      });
    }

    await context.adminRoute.chapter.getOne.invalidate();
  };

  const onDelete = () => {
    setIsLoading(true);

    deleteChapter.mutate({
      id: chapterId,
      courseId: courseId,
    });
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
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
