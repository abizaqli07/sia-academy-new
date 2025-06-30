/* eslint-disable @typescript-eslint/no-empty-function */
import type { FileRouter } from "uploadthing/next";
import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  userMentoringCv: f({
    pdf: { maxFileCount: 1, maxFileSize: "2MB" },
  }).onUploadComplete(({}) => {}),
  courseRegisterProof: f({
    "image/jpeg": { maxFileCount: 1, maxFileSize: "2MB" },
    "image/png": { maxFileCount: 1, maxFileSize: "2MB" },
  }).onUploadComplete(() => {}),
  courseImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(() => {}),
  chapterVideo: f({
    video: { maxFileCount: 1, maxFileSize: "16MB" },
  }).onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
