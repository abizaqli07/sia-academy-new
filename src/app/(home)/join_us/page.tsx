import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";

const JoinUsPage = () => {
  const today = new Date().toISOString();
  const dayOfWeek = format(today, "EEE");
  const dayOfMonth = format(today, "do");

  return (
    <div className="w-full">
      <section className="mx-auto mt-[14vh] min-h-[86vh]">
        <div className="flex w-full flex-col-reverse gap-8 md:h-[80vh] md:flex-row">
          <div className="flex h-full flex-col gap-8 md:flex-[3]">
            <div className="dark:bg-primary-dark w-full rounded-2xl bg-muted p-4 md:flex-[4]">
              <div className="flex h-full w-full flex-col justify-between">
                <div className="space-y-8">
                  {/* Title */}
                  <div className="mt-4 flex w-full flex-col items-start text-xl md:text-2xl">
                    <div className="relative w-fit font-semibold">
                      Bergabunglah{" "}
                      <span className="bg-primary absolute -top-[10px] -right-9 size-[30px] rounded-tl-full rounded-tr-full rounded-br-full md:-right-12 md:size-[35px]"></span>
                    </div>
                    <div className="w-fit">Menjadi Mentor</div>
                  </div>
                  {/* Content */}
                  <div className="font-semibold">
                    Bagikan Pengalamanmu, Bentuk Masa Depan Mereka
                  </div>
                  <div>
                    Apakah kamu seorang profesional yang ingin memberi dampak
                    nyata? Bergabunglah dengan Sia Academy sebagai mentor dan
                    jadilah bagian dari perubahan. Di Sia Academy, kami percaya
                    bahwa pengalaman adalah guru terbaik. Dengan membagikan
                    perjalanan dan keahlianmu, kamu membantu generasi baru
                    menemukan arah, membangun kepercayaan diri, dan mencapai
                    tujuan karier mereka.
                  </div>
                </div>
                {/* Button */}
                <Link href={"/auth/register_mentor"} className="self-end">
                  <Button size={"lg"}>Bergabung</Button>
                </Link>
              </div>
            </div>
            <div className="bg-muted flex w-full flex-col justify-between rounded-2xl p-4 md:flex-[1]">
              <div className="text-white">
                <div className="text-xl">Masih ragu</div>
                <div className="text-sm font-light">dengan SIA Academy?</div>
              </div>
              <div className="flex items-end justify-between text-white">
                <div className="text-xl">Temukan</div>
                <div className="flex gap-4">
                  <Link
                    href="/"
                    className="bg-primary hover:bg-primary/50 w-fit rounded-lg p-1 transition-colors duration-300 ease-in-out"
                  >
                    <IconBrandInstagram className="size-5" />
                  </Link>
                  <Link
                    href="/"
                    className="bg-primary hover:bg-primary/50 w-fit rounded-lg p-1 transition-colors duration-300 ease-in-out"
                  >
                    <IconBrandLinkedin className="size-5" />
                  </Link>
                  <Link
                    href="/"
                    className="bg-primary hover:bg-primary/50 w-fit rounded-lg p-1 transition-colors duration-300 ease-in-out"
                  >
                    <IconBrandGithub className="size-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-2xl p-3 md:h-full md:flex-[2]">
            <Image
              src="/images/hero/bg_1.jpg"
              alt="Image"
              fill
              className="-z-50"
            />
            <div className="glassmorphism mr-auto flex h-full w-[100%] flex-col justify-between rounded-xl p-4 md:w-[70%]">
              <div>
                <div className="text-5xl">{dayOfWeek}</div>
                <div className="text-4xl text-gray-500">{dayOfMonth}</div>
              </div>
              <div className="text-sm font-light">
                <div>El Samara Coworking Space, Jl. Wora Wari No.3</div>
                <div>+61-821-3145-8838</div>
              </div>
              <div className="font-medium">SIA Academy</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JoinUsPage;
