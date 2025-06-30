export const dynamic = "force-dynamic";

import BannerSliderSection from "~/components/block/banner_slider";
import { api, HydrateClient } from "~/trpc/server";
import AllMentoring from "./_components/all_mentor";

const bannerData = [
  {
    id: "1",
    image: "/images/banner/banner_1.webp",
    imageMobile: "/images/banner/banner_1.webp",
    redirectUrl: null,
  },
  {
    id: "2",
    image: "/images/banner/banner_4.webp",
    imageMobile: "/images/banner/banner_4.webp",
    redirectUrl: null,
  },
  {
    id: "3",
    image: "/images/banner/banner_5.webp",
    imageMobile: "/images/banner/banner_5.webp",
    redirectUrl: null,
  },
  {
    id: "4",
    image: "/images/banner/banner_6.webp",
    imageMobile: "/images/banner/banner_6.webp",
    redirectUrl: null,
  },
];

const MentorList = async () => {
  void api.userRoute.mentoring.getAllMentoring.prefetch();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="space-y-8 px-4 lg:px-6">
            {/* Header Section */}
            <BannerSliderSection bannerData={bannerData} />

            {/* All Course List */}
            <AllMentoring />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
};

export default MentorList;
