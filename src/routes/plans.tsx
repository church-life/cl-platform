import { createFileRoute, Outlet } from "@tanstack/react-router";

import { getAllPlansQueryOptions } from "@/data-access/plans";

export const Route = createFileRoute("/plans")({
  component: Plans,
  loader: ({ context }) => context.queryClient.ensureQueryData(getAllPlansQueryOptions),
});

function Plans() {
  const serviceTypes: ServiceType[] = [{ id: "1", title: "asd" }];

  return (
    <div className='p-2'>
      <h3>Plans</h3>

      <div>
        {serviceTypes.map((st) => (
          <div key={st.id}>{st.title}</div>
        ))}
      </div>
      <Outlet />
    </div>
  );
}

type ServiceType = {
  id: string;
  title: string;
};
