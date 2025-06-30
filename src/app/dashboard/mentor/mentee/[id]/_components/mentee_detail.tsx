/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { IconUser } from "@tabler/icons-react";
import { FileUser } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const MenteeDetail = ({ id }: { id: string }) => {
  const [data] = api.mentorRoute.mentee.getOne.useSuspenseQuery({
    mentoringDataId: id,
  });
  return (
    <div className="flex flex-col items-center justify-center px-4 lg:px-6">
      <div className="w-full max-w-2xl md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="relative grid p-0 sm:grid-cols-2">
              <div className="relative">
                <div className="relative aspect-square h-full w-full">
                  <Image
                    src={data?.user.image ?? "/images/profile_picture.jpeg"}
                    alt="Image"
                    fill
                    className="absolute inset-0 object-cover dark:brightness-[0.2] dark:grayscale"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between p-6 md:p-8">
                <div>
                  <Badge className="bg-primary/5 text-primary hover:bg-primary/5 text-base shadow-none">
                    <IconUser />
                    Mentee
                  </Badge>

                  <h3 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                    {data?.user.name}
                  </h3>
                  <div className="text-muted-foreground mt-2 space-y-1">
                    <div>Email : {data?.user.email}</div>
                    <div>Phone : {data?.user.phone ?? "No phone number"}</div>
                    <div>
                      {`Mentee have objective to ${data?.objective} with position of ${data?.positionPreference} on industry ${data?.preference}`}
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between gap-4">
                  <Link href={data?.cv ?? ""}>
                    <Button variant={"outline"}>
                      <FileUser className="mr-2 text-2xl" />
                      Download CV
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          <DataTable columns={columns} data={data?.schedules!} />
        </div>
      </div>
    </div>
  );
};

export default MenteeDetail;
