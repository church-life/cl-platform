"use client";

import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs";
import { type OAuthStrategy } from "@clerk/nextjs/server";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiLogoGoogle } from "react-icons/bi";
import { toast } from "sonner";
import { z } from "zod";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { aw } from "@/utils/aw";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";

  const { isLoaded, signIn, setActive } = useSignIn();

  const onSubmitEmail = async (data: EmailLoginForm) => {
    if (!isLoaded) return;

    setIsLoading(true);
    const [completeSignIn, err] = await aw(
      signIn.create({ identifier: data.email, password: data.password }),
    );
    setIsLoading(false);

    if (err) {
      const errorMessage = getAuthErrorMessage(err);
      toast.error(errorMessage);
      return;
    }

    if (completeSignIn.status !== "complete") {
      toast.error("No se pudo completar el inicio de sesión");
    }

    if (completeSignIn.status === "complete") {
      await setActive({ session: completeSignIn.createdSessionId });
      router.push(redirectUrl);
    }
  };

  const signInWith = (strategy: OAuthStrategy) => {
    if (!isLoaded) return;
    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/auth/sso-callback",
      redirectUrlComplete: redirectUrl,
    });
  };

  return (
    <div className='flex w-full flex-col justify-center gap-y-6'>
      <div>
        <h3 className='w-full text-xl font-bold'>Iniciar sesión</h3>
        <p className='opacity-70'> para continuar con tu cuenta de Camino de Vida</p>
      </div>

      <Button
        className='flex gap-3'
        disabled={isLoading}
        variant='outline'
        onClick={() => signInWith("oauth_google")}
      >
        <BiLogoGoogle size={20} />
        <span>Continuar con Google</span>
      </Button>

      <div className='flex items-center justify-center gap-4 text-gray-500'>
        <Separator className='flex-1' orientation='horizontal' />
        <span className='text-center text-sm'>or</span>
        <Separator className='flex-1' orientation='horizontal' />
      </div>

      <EmailForm isLoading={isLoading} onSubmit={onSubmitEmail} />
    </div>
  );
}

const emailLoginFormSchema = z.object({
  email: z.string().email({ message: "Correo inválido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
});
type EmailLoginForm = z.infer<typeof emailLoginFormSchema>;

function EmailForm({
  isLoading,
  onSubmit,
}: {
  isLoading?: boolean;
  onSubmit: (data: EmailLoginForm) => void;
}) {
  const form = useForm<EmailLoginForm>({ resolver: zodResolver(emailLoginFormSchema) });

  return (
    <Form {...form}>
      <form className='flex flex-col justify-between' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='ejemplo@gmail.com' type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='pt-4' />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='pt-4' />

        <div className='flex gap-4'>
          <Button className='flex-1 gap-3' type='submit' disabled={isLoading}>
            {isLoading ? <Spinner /> : null}
            <span>Iniciar sesión</span>
          </Button>

          {/* <Button className='flex-1 gap-3' type='button' variant='ghost' disabled={isLoading}>
            {isLoading ? <Spinner /> : null}
            <span>Olvidé mi contraseña</span>
          </Button> */}
        </div>

        <div className='pt-4' />

        <div className='flex items-center gap-x-2 text-sm'>
          <p>No tienes una cuenta?</p>
          <Button className='w-fit p-0' variant='link' asChild>
            <Link href='/auth/sign-up'>Regístrate</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

function getAuthErrorMessage(err: unknown) {
  if (isClerkAPIResponseError(err)) {
    return err.errors[0]?.longMessage || err.message;
  }
  return String(err);
}
