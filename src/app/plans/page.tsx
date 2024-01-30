import { Button } from "@/components/ui/button";
import { getAllPlansQueryOptions } from "@/data-access/plans";

export default function Plans() {
  const serviceTypes: ServiceType[] = [{ id: "1", title: "asd" }];

  return (
    <div className='bg-red-300 p-2'>
      <h3>Plans</h3>

      <div>
        {serviceTypes.map((st) => (
          <div key={st.id}>{st.title}</div>
        ))}
      </div>

      <Button>Test</Button>
    </div>
  );
}

type ServiceType = {
  id: string;
  title: string;
};
