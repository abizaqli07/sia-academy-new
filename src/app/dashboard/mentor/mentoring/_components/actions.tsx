"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

interface ActionsProps {
  disabled: boolean;
  mentoringId: string;
  isPublished: boolean;
}

export const Actions = ({
  disabled,
  mentoringId,
  isPublished,
}: ActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const context = api.useUtils();

  const pub = api.mentorRoute.mentoring.publish.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Mentoring Published",
      });
      await context.mentorRoute.mentoring.getData.invalidate();
      setIsLoading(false);
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const unPub = api.mentorRoute.mentoring.unpublish.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Mentoring Unpublished",
      });
      await context.mentorRoute.mentoring.getData.invalidate();
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
        mentoringId: mentoringId,
      });
    } else {
      pub.mutate({
        mentoringId: mentoringId,
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
