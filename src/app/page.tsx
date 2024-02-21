import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <div className='container flex flex-col items-center justify-center gap-12 px-4 py-16 '>
        <h1 className='text-5xl font-extrabold tracking-tight sm:text-[5rem]'>Church Life</h1>

        <div className='flex flex-col items-center'>
          <p className='text-lg font-semibold'>Haga click en el botón para ingresar al dashboard</p>

          <Button className='mx-auto' asChild>
            <Link href='/dashboard'>Dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
