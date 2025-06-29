import { ArrowUpRight, Quote } from "lucide-react";
import Image from "next/image";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen w-full">
      {/* ================= Hero ================ */}
      <section className="mx-auto mt-32 h-screen md:mt-0">
        <div className="flex h-full w-full flex-col gap-20">
          <div className="flex flex-[3] flex-col items-center gap-y-12 md:flex-row md:justify-between">
            {/* Main Title */}
            <div className="flex max-w-[500px] flex-col items-start gap-12 self-start text-3xl font-semibold md:self-end md:text-5xl">
              <div className="flex items-center gap-6">
                Unleash{" "}
                <div className="title__comp">
                  <Image src="/images/hero/image_4.jpg" alt="Image" fill />
                </div>
              </div>
              <div className="flex items-center gap-6">Your Talent</div>
              <div className="flex items-center gap-6">
                Full{" "}
                <div className="title__comp">
                  <Image src="/images/hero/image_2.jpg" alt="Image" fill />
                </div>{" "}
                Potential
              </div>
            </div>
            {/* Description */}
            <div className="flex w-full max-w-[500px] flex-col gap-8">
              <div>
                Di Sia Academy, kami hadir sebagai platform career mentoring dan
                bootcamp yang dirancang untuk membekali Anda dengan keterampilan
                praktis, wawasan industri, dan dukungan langsung dari
                mentor-mentor profesional.
              </div>
              <div className="flex w-fit items-center justify-center gap-4 rounded-full bg-muted dark:bg-primary-dark px-8 py-4">
                <div>Lebih Banyak</div>
                <ArrowUpRight />
              </div>
            </div>
          </div>
          {/* Main Image */}
          <div className="relative h-full w-full flex-[2] overflow-hidden rounded-3xl bg-muted">
            <Image src="/images/hero/bg_2.jpg" alt="Image" fill />
            <div className="absolute bottom-0 right-0 z-20 flex h-[70px] w-[310px] items-center justify-center gap-4 rounded-2xl border-[5px] border-background bg-secondary py-4">
              <div>Lebih Banyak</div>
              <ArrowUpRight />
            </div>
          </div>
        </div>
      </section>

      {/* ========================== About ========================= */}
      <section className="container mx-auto mt-40">
        <div className="relative flex h-fit w-full flex-col-reverse justify-end gap-y-8 md:flex-row">
          {/* Desc */}
          <div className="bottom-0 left-0 z-50 flex h-fit max-w-[900px] flex-col gap-8 md:absolute">
            <div className="w-fit border-b-4 border-primary pb-4 text-5xl font-light md:text-7xl lg:text-8xl">
              What We Say <br /> About Our Self
            </div>
            <div className="flex items-start justify-start gap-4">
              <div className="text-primary">
                <Quote size={50} />
              </div>
              <div>
                Di Sia Academy, kami percaya bahwa setiap individu memiliki
                potensi besar untuk berkembang dan mencapai karier impian
                mereka. Dengan pendekatan pembelajaran yang adaptif dan berfokus
                pada pengalaman nyata, Sia Academy membantu Anda tidak hanya
                belajar, tetapi juga tumbuh dan berani mengambil langkah nyata
                menuju masa depan yang lebih cerah.
              </div>
            </div>
          </div>
          {/* Image */}
          <div className="grid w-fit grid-cols-2 grid-rows-2 gap-4">
            <div className="relative h-[200px] w-[150px] sm:h-[300px] sm:w-[200px] overflow-hidden rounded-br-[70px] rounded-tl-[70px] bg-gray-100">
              <Image src="/images/hero/hero.jpg" alt="Main Image" fill />
            </div>
            <div className="relative h-[200px] w-[150px] sm:h-[300px] sm:w-[200px] overflow-hidden rounded-bl-[70px] rounded-tr-[70px] bg-gray-100">
              <Image src="/images/hero/hero_3.jpg" alt="Main Image" fill />
            </div>
            <div className="relative col-start-2 h-[200px] w-[150px] sm:h-[300px] sm:w-[200px] overflow-hidden rounded-bl-[70px] rounded-br-[70px] rounded-tl-[70px] bg-gray-100">
              <Image src="/images/hero/hero_2.jpg" alt="Main Image" fill />
              <div className="absolute bottom-0 left-0 right-0 top-0 bg-white/30"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
