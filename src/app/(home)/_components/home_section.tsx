"use client";

import { ArrowUpRight, BookCheck, Users } from "lucide-react";
import { type Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { currencyFormatter } from "~/lib/utils";
import { api } from "~/trpc/react";

const tabs = [
  {
    id: "mentor",
    title: "Mentor",
  },
  {
    id: "bootcamp",
    title: "Bootcamp",
  },
];

interface BootcampPropsInterface {
  session: Session | null;
}

const HomeSection = ({ session }: BootcampPropsInterface) => {
  const [tab, setTab] = useState("mentor");
  const [course] = api.userRoute.course.getFeaturedCourse.useSuspenseQuery();
  const [mentoring] =
    api.userRoute.mentoring.getFeaturedMentoring.useSuspenseQuery();

  return (
    <div className="min-h-screen w-full">
      {/* ========== Hero ========== */}
      <section className="container mx-auto h-screen">
        <div className="flex h-full w-full flex-col space-y-20 pt-32 md:pt-52">
          <div className="relative">
            {/* Main Header */}
            <div className="relative z-10 flex flex-col items-center gap-12 text-xl font-semibold md:text-4xl lg:text-6xl">
              <div className="flex items-center gap-6">
                Semua{" "}
                <div className="title__comp">
                  {" "}
                  <Image src="/images/hero/image_2.jpg" alt="Image" fill />
                </div>{" "}
                Yang Kamu
              </div>
              <div className="flex items-center gap-6">
                Butuhkan Untuk{" "}
                <div className="title__comp">
                  <Image src="/images/hero/image_4.jpg" alt="Image" fill />
                </div>{" "}
                Menggali
              </div>
              <div className="flex items-center gap-6">Potensi & Bakatmu</div>
            </div>

            {/* Main Image */}
            <div className="absolute -top-[30px] left-0 z-0 hidden flex-col md:flex">
              <div className="bg-primary h-[490px] w-[320px] overflow-hidden rounded-tl-[100px] rounded-br-[100px]">
                <div className="relative h-[410px] w-full overflow-hidden rounded-br-[100px] bg-gray-100">
                  <Image src="/images/hero/hero.jpg" alt="Main Image" fill />
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/30"></div>
                </div>
                <div className="h-[80px] items-end p-4 text-xs font-semibold text-white md:text-sm">
                  Bangun <br /> Masa Depanmu
                </div>
              </div>
            </div>
          </div>

          {/* Main Desc */}
          <div className="relative z-10 max-w-[300px] space-y-4 self-center text-center md:self-end md:text-left">
            <div className="text-2xl font-medium">Memberi Hasil Terbaik</div>
            <div className="font-light">
              Full Online dan Dipandu oleh Praktisi Senior. Praktikal, lebih
              dari sekadar Webinar. Fokus Bantu Kembangkan Skill dan Portfolio
              Ribuan Alumni.
            </div>
          </div>
        </div>
      </section>

      {/* ========== About ========== */}
      <section className="container mx-auto mt-8">
        <div className="relative h-full w-full space-y-8">
          {/* Title */}
          <div className="flex w-full flex-col items-center text-2xl md:text-4xl">
            <div className="relative w-fit font-semibold">
              Tentang{" "}
              <span className="bg-primary absolute -top-[17px] -right-12 size-[40px] rounded-tl-full rounded-tr-full rounded-br-full md:-right-16 md:size-[50px]"></span>
            </div>
            <div className="w-fit">SIA Academy</div>
          </div>

          {/* Content */}
          <div className="relative flex flex-col space-y-8 gap-x-4 md:grid md:grid-cols-[1fr_3fr_1fr]">
            <div className="hidden flex-col justify-end gap-3 opacity-0 lg:flex">
              <div className="text-3xl font-medium">Cerita Kami</div>
              <div className="font-light">
                Di Sia Academy, kami hadir sebagai platform career mentoring dan
                bootcamp yang dirancang untuk membekali Anda dengan keterampilan
                praktis, wawasan industri, dan dukungan langsung dari
                mentor-mentor profesional.
              </div>
            </div>

            <div className="bottom-0 left-6 flex max-w-[300px] flex-col justify-end gap-3 lg:absolute">
              <div className="text-2xl font-medium md:text-3xl">
                Cerita Kami
              </div>
              <div className="text-sm font-light md:text-base">
                Di Sia Academy, kami hadir sebagai platform career mentoring dan
                bootcamp yang dirancang untuk membekali Anda dengan keterampilan
                praktis, wawasan industri, dan dukungan langsung dari
                mentor-mentor profesional.
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative h-full w-full md:h-fit">
                <svg
                  className="about__svg relative size-full"
                  viewBox="0 0 1058 515"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 50C0 22.3858 22.3858 0 50 0H1008C1035.61 0 1058 22.3858 1058 50V332C1058 359.614 1035.61 382 1008 382H600C572.386 382 550 404.386 550 432V465C550 492.614 527.614 515 500 515H188C160.386 515 138 492.614 138 465V186C138 158.386 115.614 136 88 136H50C22.3858 136 0 113.614 0 86V50Z"
                    fill="url(#pattern0_3399_173)"
                  />
                  <defs>
                    <pattern
                      id="pattern0_3399_173"
                      patternContentUnits="objectBoundingBox"
                      width="1"
                      height="1"
                    >
                      <use
                        xlinkHref="#image0_3399_173"
                        transform="matrix(0.00025 0 0 0.000513592 0 -0.270388)"
                      />
                      <image
                        id="image0_3399_173"
                        width={4000}
                        height={3000}
                        xlinkHref="/images/hero/bg_2.jpg"
                      />
                    </pattern>
                  </defs>
                </svg>
                <Link href="/">
                  <div className="bg-primary absolute right-0 bottom-0 flex aspect-[4/1] w-[45%] items-center justify-center gap-4 rounded-3xl py-4">
                    <div className="text-sm">Lebih Banyak</div>
                    <ArrowUpRight className="size-[15px]" />
                  </div>
                </Link>
              </div>
            </div>

            <div className="ml-4 flex flex-row items-start gap-8 md:flex-col">
              <div className="flex-[1]">
                <div className="text-4xl font-semibold md:text-5xl">
                  10 <span className="text-primary">+</span>
                </div>
                <div className="font-light">Years of experience</div>
              </div>
              <div className="flex-[1]">
                <div className="text-4xl font-semibold md:text-5xl">
                  20 <span className="text-primary">+</span>
                </div>
                <div className="font-light">Professional Mentors</div>
              </div>
              <div className="flex-[1]">
                <div className="text-4xl font-semibold md:text-5xl">
                  3K <span className="text-primary">+</span>
                </div>
                <div className="font-light">Happy Student</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============== Bootcamp ============= */}
      <section className="container mx-auto mt-48">
        <div className="relative h-full w-full space-y-8">
          {/* Title */}
          <div className="flex w-full flex-col items-center text-2xl md:text-4xl">
            <div className="relative w-fit font-semibold">
              Kreatif{" "}
              <span className="bg-primary absolute -top-[17px] -right-12 size-[40px] rounded-tl-full rounded-tr-full rounded-br-full md:-right-16 md:size-[50px]"></span>
            </div>
            <div className="w-fit">Mentor & Bootcamp</div>
          </div>

          {/* Content Tabs */}
          <div className="flex w-full justify-center gap-6 overflow-x-auto">
            {tabs.map((data) => (
              <div
                key={data.id}
                className={`border-primary cursor-pointer rounded-xl border-[thin] px-6 py-2 ${tab === data.id ? "bg-primary" : "bg-white"}`}
                onClick={() => setTab(data.id)}
              >
                <div
                  className={`text-lg font-bold ${tab === data.id ? "text-white" : "text-primary"}`}
                >
                  {data.title}
                </div>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex w-full flex-wrap items-stretch justify-center gap-8">
            {tab === "bootcamp" ? (
              course.length > 0 ? (
                course.map((data) => (
                  <Link
                    key={data.id}
                    href={
                      session
                        ? `/dashboard/user/course/${data.id}`
                        : "/auth/signin"
                    }
                    className="dark:bg-gray-900 flex w-full max-w-[320px] flex-col gap-6 rounded-lg p-4 shadow-md"
                  >
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-gray-500">
                      <Image
                        alt="Course Image"
                        src={
                          data.image ??
                          "/images/courses/aimasterclass_thumbnail.png"
                        }
                        fill
                        className="object-cover object-left-top"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="bg-primary w-fit rounded-lg px-2 py-1 text-sm font-semibold text-white">
                        {data.category?.name}
                      </div>
                      <div className="text-lg font-semibold">{data.title}</div>
                      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-400">
                        <div className="flex items-center gap-2 font-medium">
                          <BookCheck className="text-xl" />{" "}
                          {data.materi?.split(",").length} Sessions
                        </div>
                        <div className="flex items-center gap-2 font-medium">
                          <Users className="text-xl" /> {data.purchases.length}+
                          Students
                        </div>
                      </div>
                      <div>
                        <div className={`${data.isSale ? "line-through text-sm" : ""}`}>
                          {currencyFormatter.format(Number(data.price))}
                        </div>
                        {data.isSale ? (
                          <div className="text-primary text-lg font-semibold">
                            {currencyFormatter.format(Number(data.salePrice))}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                      {session ? (
                        <Button className="mt-3">Daftar Sekarang</Button>
                      ) : (
                        <Button className="mt-3">Login Terlebih Dahulu</Button>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="bg-muted flex h-[200px] items-center justify-center rounded-lg px-24 py-4 text-center">
                  <div className="text-2xl font-semibold">
                    Belum Ada Bootcamp
                  </div>
                </div>
              )
            ) : mentoring.length > 0 ? (
              mentoring.map((data) => (
                <Link
                  key={data.id}
                  href={
                    session
                      ? `/dashboard/user/mentoring/${data.id}`
                      : "/auth/signin"
                  }
                  className="dark:bg-gray-900 flex w-full max-w-[330px] flex-col justify-between gap-6 rounded-lg p-4 shadow-md"
                >
                  <div className="w-full space-y-6">
                    <div className="relative aspect-[1/1] w-full overflow-hidden rounded-lg bg-gray-500">
                      <Image
                        alt="Course Image"
                        src={
                          data.mentor.image ??
                          "/images/courses/aimasterclass_thumbnail.png"
                        }
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-xl font-semibold">
                        {data.mentor.name}
                      </div>
                      <div className="text-base font-semibold">
                        {data.mentor.title}
                      </div>
                      <div className="mt-3 flex items-center gap-3 text-gray-700">
                        <div className="flex items-center gap-2 font-medium">
                          <BookCheck className="text-xl" />{" "}
                          {data.mentor.company}
                        </div>
                        <div className="flex items-center gap-2 font-medium">
                          <Users className="text-xl" /> {data.mentor.industry}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {data.mentor.expertise
                          .split(",")
                          .map((expert, index) => (
                            <div
                              key={index}
                              className="bg-muted w-fit rounded-lg px-2 py-1 text-sm font-semibold text-muted-foreground"
                            >
                              {expert}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  {session ? (
                    <Button className="mt-3">Booking Sekarang</Button>
                  ) : (
                    <Button className="mt-3">Login Terlebih Dahulu</Button>
                  )}
                </Link>
              ))
            ) : (
              <div className=" bg-muted flex h-[200px] items-center justify-center rounded-lg px-24 py-4 text-center">
                <div className="text-2xl font-semibold">
                  Belum Ada Mentoring
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSection;
