import {
  IconCertificate,
  IconClipboardText,
  IconVideo,
} from "@tabler/icons-react";

const BootcampBenefitComp = () => {
  return (
    <div className="mt-[30px] w-full rounded-lg text-center">
      <div className="text-xl font-bold">
        Banyak Manfaat <br /> yang kamu dapatkan
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-8">
        <div className="hover:bg-primary/50 flex max-w-[260px] flex-col items-center gap-3 rounded-lg p-4 text-gray-700 shadow-md transition-all duration-300 ease-in-out hover:text-white hover:shadow-lg dark:text-gray-300">
          <div className="bg-primary-dark flex h-20 w-20 items-center justify-center rounded-lg">
            <IconVideo className="text-primary size-12" />
          </div>
          <div className="font-medium">
            Akses Recording Pembelajaran Melalui Website
          </div>
          <div>
            Video Pembelajaran akan didapatkan dalam berbentuk recording kelas
            bootcamp yang telah dijalankan, peserta akan mendapatkan akses video
            melalui website
          </div>
        </div>
        <div className="hover:bg-primary/50 flex max-w-[260px] flex-col items-center gap-3 rounded-lg p-4 text-gray-700 shadow-md transition-all duration-300 ease-in-out hover:text-white hover:shadow-lg dark:text-gray-300">
          <div className="bg-primary-dark flex h-20 w-20 items-center justify-center rounded-lg">
            <IconCertificate className="text-primary size-12" />
          </div>
          <div className="font-medium">Sertifikat Kompetensi</div>
          <div>
            Sertifikat dengan “Certified AI & Machine Learning Developer” akan
            diberikan di akhir bootcamp dengan predikat Entry Level
          </div>
        </div>
        <div className="hover:bg-primary/50 flex max-w-[260px] flex-col items-center gap-3 rounded-lg p-4 text-gray-700 shadow-md transition-all duration-300 ease-in-out hover:text-white hover:shadow-lg dark:text-gray-300">
          <div className="bg-primary-dark flex h-20 w-20 items-center justify-center rounded-lg">
            <IconClipboardText className="text-primary size-12" />
          </div>
          <div className="font-medium">Portofolio Proyek</div>
          <div>
            Case akan diberikan berbentuk project developing sebuah kecerdasan
            buatan yang akan sesuai dengan materi yang diterangkan, dan dapat
            digunakan sebagai portofolio
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootcampBenefitComp;
