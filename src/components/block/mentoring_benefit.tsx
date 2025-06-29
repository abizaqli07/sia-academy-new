import { LiaIndustrySolid } from "react-icons/lia";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { FaUserSecret } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { VscGraph } from "react-icons/vsc";

const benefits = [
  {
    id: "0",
    image: <LiaIndustrySolid />,
    title: "Insights Dalam Industri",
  },
  {
    id: "1",
    image: <HiOutlineDocumentSearch />,
    title: "CV Review",
  },
  {
    id: "2",
    image: <FaUserSecret />,
    title: "Bimbingan Job Hunting",
  },
  {
    id: "3",
    image: <HiOutlineUserGroup />,
    title: "Latihan Interview dengan HR Professional",
  },
  {
    id: "4",
    image: <VscGraph />,
    title: "Garansi Peningkatan Job Hunting",
  },
];

const MentoringBenefitComp = () => {
  return (
    <div className="mt-[30px] w-full rounded-lg">
      <div className="text-xl font-bold">
        <span className="text-sm text-primary">Benefit</span> <br />
        Benefit yang didapatkan
      </div>
      <div className=" mt-8 flex flex-wrap items-start justify-center gap-4 text-center">
        {benefits.map((data) => (
          <div
            key={data.id}
            className="flex w-[160px] shrink-0 flex-col items-center justify-center gap-3 p-4 text-center"
          >
            <div className="flex size-[80px] items-center justify-center overflow-hidden rounded-lg bg-primary-dark text-5xl text-primary">
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
