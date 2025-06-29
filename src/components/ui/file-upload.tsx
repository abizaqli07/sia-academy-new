"use client";

import { toast } from "sonner";
import type { ourFileRouter } from "~/app/api/uploadthing/core";
import { UploadDropzone } from "~/lib/uploadthing";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      className="ut-button:bg-primary ut-button:px-2 ut-button:mb-2 ut-label:text-primary"
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.ufsUrl);
      }}
      onUploadError={(error: Error) => {
        toast("Error", {
          description: error.message,
        });
      }}
    />
  );
};
