"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { loginSchema, registerSchema } from "../lib/schemas";
import toast from "react-hot-toast";
import { useUser } from "../context/UserContext";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showNotAvailable, setShowNotAvailable] = useState(false);
  const { loginUser } = useUser();

  const form = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(!isLogin && { name: "", role: "doctor" }),
    },
  });

  const onSubmit = async (data) => {
    if (!isLogin) {
      setShowNotAvailable(true);
      setTimeout(() => setShowNotAvailable(false), 3000);
      return;
    }

    try {
      await loginUser(data);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="flex  lg:max-h-4/5 lg:max-w-2/3 m-auto shadow-md rounded-xl">
      {/* Left Side - Banner */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-blue-400 to-blue-500 p-12 text-white rounded-l-xl ">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4">DentSoft</h1>
          <p className="text-lg mb-8">
            Advanced clinic management system for modern dental practices
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white md:rounded-r-xl rounded-lg md:rounded-none">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2 text-blue-500">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-blue-500 mb-8">
            {isLogin ? "Sign in to your account" : "Get started with DentSoft"}
          </p>

          {showNotAvailable && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
              Registration is not available at this time. Please contact
              support.
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 text-gray-600"
            >
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isLogin && (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="doctor" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Doctor
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="receptionist" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Receptionist
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 font-bold"
              >
                {isLogin ? "Sign In" : "Register"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {isLogin
                ? "Need an account? Register"
                : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
