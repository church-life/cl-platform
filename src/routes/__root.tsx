import { type QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <>
      <div className='flex gap-2 p-2'>
        <Link to='/' className='[&.active]:font-bold'>
          Home
        </Link>
        <Link to='/about' className='[&.active]:font-bold'>
          About
        </Link>
        <Link to='/dashboard' className='[&.active]:font-bold'>
          Dashboard
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
});
