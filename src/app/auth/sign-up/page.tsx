"use client";

import { isClerkAPIResponseError, useSignUp } from "@clerk/nextjs";
import { type OAuthStrategy } from "@clerk/nextjs/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
// import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { components } from "@/lib/api";
import { aw } from "@/utils/aw";
import { isNestError } from "@/utils/errors";

// import { useSignUp as useSignUp2 } from "./mutations";

type DocumentType = components["schemas"]["DocumentType"];
const documentTypes = ["DNI", "PASSPORT", "OTHER"] as const satisfies DocumentType[];

const documentTypesWithLabel = [
  { value: "DNI", label: "DNI" },
  { value: "PASSPORT", label: "Pasaporte" },
  { value: "OTHER", label: "Otro" },
] as const satisfies { value: DocumentType; label: string }[];

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { isLoaded, signUp, setActive } = useSignUp();

  // const signUpMutation = useSignUp2({
  //   onError: (err) => {
  //     if (isNestError(err)) {
  //       toast.error(err.message);
  //     }
  //     toast.error("Algo salió mal");
  //     return;
  //   },
  //   onSuccess: () => {
  //     toast.success("Registrado correctamente");
  //     router.push("/auth/sign-in");
  //   },
  // });

  const onSubmit = async (data: SignUpForm) => {
    if (!isLoaded) return;

    setIsLoading(true);
    const [completeSignIn, err] = await aw(
      signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.names,
        lastName: data.lastNames,
      }),
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
        <p className='text-sm opacity-70'>para continuar a Camino de Vida</p>
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
    documentType: z.enum(documentTypes),
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

  console.log(form.formState.errors);

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

        <div className='grid w-full grid-cols-2 gap-x-4'>
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

          <FormField
            control={form.control}
            name='birthDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de nacimiento</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* <div className=''>
          <PhoneInput countries={[]} />
        </div> */}

        <div className='pt-4' />

        <div className='grid w-full grid-cols-2 gap-x-4'>
          <FormField
            control={form.control}
            name='documentType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de documento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {documentTypesWithLabel.map((x) => (
                      <SelectItem key={x.value} value={x.value}>
                        {x.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
