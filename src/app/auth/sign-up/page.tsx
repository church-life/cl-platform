"use client";

import { isClerkAPIResponseError, useSignUp } from "@clerk/nextjs";
import { type OAuthStrategy } from "@clerk/nextjs/server";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiLogoGoogle } from "react-icons/bi";
import { toast } from "sonner";
import z from "zod";

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

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { isLoaded, signUp, setActive } = useSignUp();

  const onSubmit = async (data: SignUpForm) => {
    if (!isLoaded) return;

    setIsLoading(true);
    const [completeSignIn, err] = await aw(
      signUp.create({ emailAddress: data.email, password: data.password }),
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
      router.push("/");
    }
  };

  const signUpWith = (strategy: OAuthStrategy) => {
    if (!isLoaded) return;
    return signUp.authenticateWithRedirect({
      strategy,
      redirectUrl: "/auth/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className='flex w-full flex-col justify-center gap-y-6'>
      <div>
        <h3 className='w-full text-xl font-bold text-primary'>Crea tu cuenta</h3>
        <p className='text-sm opacity-70'> para continuar a Camino de Vida</p>
      </div>

      <Button
        className='flex gap-3'
        disabled={isLoading}
        variant='outline'
        onClick={() => signUpWith("oauth_google")}
      >
        <BiLogoGoogle size={20} />
        <span>Continuar con Google</span>
      </Button>

      <div className='flex items-center justify-center gap-4 text-gray-500'>
        <Separator className='flex-1' orientation='horizontal' />
        <span className='text-center text-sm'>or</span>
        <Separator className='flex-1' orientation='horizontal' />
      </div>

      <SignUpForm isLoading={isLoading} onSubmit={onSubmit} />
    </div>
  );
}

const signUpFormSchema = z
  .object({
    displayName: z.string().min(1),
    names: z.string().min(1),
    lastNames: z.string().min(1),
    email: z.string().email({ message: "Correo inválido" }),
    phone: z.string().min(1),
    documentType: z.string().min(1),
    documentId: z.string().min(1),
    birthDate: z.string().min(1),
    password: z.string().min(1, { message: "La contraseña es requerida" }),
    verifyPassword: z.string().min(1, { message: "La contraseña es requerida" }),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "Las contraseñas no coinciden",
    path: ["verifyPassword"],
  });

type SignUpForm = z.infer<typeof signUpFormSchema>;

function SignUpForm({
  isLoading,
  onSubmit,
}: {
  isLoading?: boolean;
  onSubmit: (data: SignUpForm) => void;
}) {
  const form = useForm<SignUpForm>({ resolver: zodResolver(signUpFormSchema) });

  return (
    <Form {...form}>
      <form className='flex flex-col justify-between' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid w-full grid-cols-2 gap-x-4'>
          <FormField
            control={form.control}
            name='names'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lastNames'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='pt-4' />

        <FormField
          control={form.control}
          name='displayName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre preferido (apodo)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='pt-4' />

        <div className='grid w-full grid-cols-2 gap-x-4'>
          <FormField
            control={form.control}
            name='documentType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de documento</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='documentId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de documento</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='pt-4' />

        <div className='grid w-full grid-cols-2 gap-x-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celular</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <FormField
          control={form.control}
          name='verifyPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
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
            <span>Registrarme</span>
          </Button>
        </div>

        <div className='pt-4' />

        <div className='flex items-center gap-x-2 text-sm'>
          <p>Ya tienes una cuenta?</p>
          <Button className='w-fit p-0' variant='link' asChild>
            <Link href='/auth/sign-in'>Ingresa</Link>
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
