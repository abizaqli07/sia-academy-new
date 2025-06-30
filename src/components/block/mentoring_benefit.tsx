import {
  IconBriefcase,
  IconBuildingFactory2,
  IconChartInfographic,
  IconFileLike,
  IconUserScan
} from "@tabler/icons-react";

const benefits = [
  {
    id: "0",
    image: <IconBuildingFactory2 className="size-8" />,
    title: "Insights Dalam Industri",
  },
  {
    id: "1",
    image: <IconFileLike className="size-8" />,
    title: "CV Review",
  },
  {
    id: "2",
    image: <IconBriefcase className="size-8" />,
    title: "Bimbingan Job Hunting",
  },
  {
    id: "3",
    image: <IconUserScan className="size-8" />,
    title: "Latihan Interview dengan HR Professional",
  },
  {
    id: "4",
    image: <IconChartInfographic className="size-8" />,
    title: "Garansi Peningkatan Job Hunting",
  },
];

const MentoringBenefitComp = () => {
  return (
    <div className="mt-[30px] w-full rounded-lg">
      <div className="text-xl font-bold">
        <span className="text-primary text-sm">Benefit</span> <br />
        Benefit yang didapatkan
      </div>
      <div className="mt-8 flex flex-wrap items-start justify-center gap-4 text-center">
        {benefits.map((data) => (
          <div
            key={data.id}
            className="flex w-[160px] shrink-0 flex-col items-center justify-center gap-3 p-4 text-center"
          >
            <div className="bg-muted text-primary flex size-[80px] items-center justify-center overflow-hidden rounded-lg text-5xl">
              {data.image}
            </div>
            <div className="text-lg font-semibold">{data.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentoringBenefitComp;
