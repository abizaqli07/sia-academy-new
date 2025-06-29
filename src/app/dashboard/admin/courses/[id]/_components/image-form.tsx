"use client";

import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { FileUpload } from "~/components/ui/file-upload";
import { api, type RouterOutputs } from "~/trpc/react";

interface ImageFormProps {
  initialData: RouterOutputs["adminRoute"]["course"]["getOne"];
  courseId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  image: z.string().min(1),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const context = api.useUtils();

  const course = api.adminRoute.course.update.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Image updated",
      });
      toggleEdit();
      await context.adminRoute.course.invalidate();
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    course.mutate({
      ...values,
      id: courseId,
    });
  };

  return (
    <div className="bg-muted mt-6 rounded-md border p-4">
      <div className="flex items-center justify-between font-medium">
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.image && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add an image
            </>
          )}
          {!isEditing && initialData.image && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.image ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              alt="Upload"
              fill
              className="rounded-md object-cover"
              src={initialData.image}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ image: url });
              }
            }}
          />
          <div className="text-muted-foreground mt-4 text-xs">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
