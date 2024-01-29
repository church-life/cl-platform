import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/plans/$planId")({
  component: PlanComponent,
});

function PlanComponent() {
  const { planId } = Route.useParams();

  const serviceTypes: ServiceType[] = [{ id: "1", title: "asd" }];

  return (
    <div className='p-2'>
      <h3>Welcome Plans {planId}</h3>

      <div>
        {serviceTypes.map((st) => (
          <div key={st.id}>{st.title}</div>
        ))}
      </div>
    </div>
  );
}

type ServiceType = {
  id: string;
  title: string;
};
