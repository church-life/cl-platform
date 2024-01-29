import { useState } from "react";

import { cn } from "@/utils/cn";

export const App = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + React</h1>
      <div className="text-blue-500">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p className={cn("bg-red-100", "text-red-600")}>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
};
