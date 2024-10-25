"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form"; 
import { UserSchema } from "@/schemas";
import { FormError } from "./form-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; 
import { useState } from "react"; 
import { Spinner } from '@/components/ui/spinner';

export const LoginForm = () => {
  const router = useRouter(); 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (values: z.infer<typeof UserSchema>) => {
    setLoading(true);
    setError(false);
    try {
      const signInData = await signIn('credentials', {
        redirect: false, // Disable automatic redirect, handle manually
        email: values.email,
        password: values.password
      });
  
      if (signInData?.error) {
        console.log("Login failed:", signInData.error);
        setErrorMessage(signInData.error);
        setError(true);
        setLoading(false);
        return;
      }
  
      if (signInData?.ok) {
        console.log("Login Successful");
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error from catch:', error);
      setErrorMessage('Login failed. Please check your email and password and try again.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-96 w-full px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='mail@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Enter your password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && <FormError message={errorMessage} /> }
          <Button className='w-full mt-6' type='submit'>
            {loading ? <Spinner size="sm" /> : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
