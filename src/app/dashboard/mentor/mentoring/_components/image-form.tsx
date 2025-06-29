"use client";

import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import type * as z from "zod";
import { Button } from "~/components/ui/button";
import { FileUpload } from "~/components/ui/file-upload";
import { type UpdateMentorSchema } from "~/server/validator/mentoring";
import { api } from "~/trpc/react";

interface ImageFormProps {
  initialData: string | null;
  mentorId: string;
}

export const ImageForm = ({ initialData, mentorId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const context = api.useUtils();

  const course = api.mentorRoute.mentoring.updateMentor.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Image updated",
      });
      toggleEdit();
      await context.mentorRoute.mentoring.getData.invalidate();
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
    },
  });

  const onSubmit = (values: z.infer<typeof UpdateMentorSchema>) => {
    course.mutate({
      ...values,
      id: mentorId,
    });
  };

  return (
    <div className="mt-6 rounded-md border bg-muted p-4">
      <div className="flex items-center justify-between font-medium">
        Mentor image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Batalkan</>}
          {!isEditing && !initialData && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah gambar
            </>
          )}
          {!isEditing && initialData && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit gambar
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              alt="Upload"
              fill
              className="rounded-md object-cover"
              src={initialData}
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
            1:2 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
