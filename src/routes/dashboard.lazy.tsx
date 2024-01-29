import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const serviceTypes: ServiceType[] = [{ id: "1", title: "asd" }];

  return (
    <div className='p-2'>
      <h3>Welcome Dashboard Servicios</h3>

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
