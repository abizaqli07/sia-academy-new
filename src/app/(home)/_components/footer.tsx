import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

const Footer = () => {
  return (
    <div className="h-full w-full">
      <section className="mx-auto max-w-screen-xl mt-32 md:mt-48 px-4">
        <div className="flex flex-col md:flex-row h-full md:h-[350px] w-full items-center justify-between gap-4">
          {/* Grid 1 */}
          <div className="footer__box">
            <div className="space-y-2">
              <div className="text-sm font-light">More Offers</div>
              <div className="text-xl md:text-xl lg:text-3xl font-semibold">
                There is <br /> something else <br /> for you
              </div>
            </div>
            <Button className="flex w-fit items-center gap-x-2">
              Find More <ChevronRight />
            </Button>
          </div>
          <div className="flex h-full w-full flex-[1] flex-col gap-y-4">
            {/* Grid 2 */}
            <div className="footer__box">
              <div className="flex items-start justify-between">
                <div className="text-sm font-light">
                  Behold <br /> Our Greatnessess
                </div>
                <Link href="/">
                  <ArrowUpRight />
                </Link>
              </div>
              <div className="text-xl md:text-xl lg:text-3xl font-semibold">View our projects</div>
            </div>
            <div className="flex flex-col md:flex-row w-full flex-[1] gap-4">
              {/* Grid 3 */}
              <div className="footer__box">
                <div className="flex items-start justify-between">
                  <div className="text-sm font-light">
                    Discover <br /> Our History
                  </div>
                  <Link href="/">
                    <ArrowUpRight />
                  </Link>
                </div>
                <div className="text-xl md:text-xl lg:text-3xl font-semibold">About Us</div>
              </div>
              {/* Grid 4 */}
              <div className="footer__box">
                <div className="flex items-start justify-between">
                  <div className="text-sm font-light">
                    Have Some <br />
                    Question?
                  </div>
                  <Link href="/">
                    <ArrowUpRight />
                  </Link>
                </div>
                <div className="text-xl md:text-xl lg:text-3xl font-semibold">Contact Us</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto my-8">
        <div className="w-full text-center text-sm font-light text-gray-500">
          Copyright &#169; 2025 SIA Academy. All right reserved
        </div>
      </section>
    </div>
  );
};

export default Footer;
