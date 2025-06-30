export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import UpdateData from "./_components/update_data";

const UserSettingPage = async () => {
  void api.authRoute.getUserData.prefetch();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <UpdateData />
        </div>
      </div>
    </HydrateClient>
  );
};

export default UserSettingPage;
