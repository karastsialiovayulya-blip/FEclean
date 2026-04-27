"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { SignUpCustomerAction } from "@/lib/api/actions/auth";
import { registrUser } from "@/lib/model";
import { userStore } from "@/lib/store/userStore";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RegUserData {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export default function SignUp() {
  const [stateIn, signUp, isPending] = useActionState(SignUpCustomerAction, null);
  const [userData, setUserData] = useState<RegUserData>({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (formData: RegUserData) => {
    try {
      registrUser.parse(formData);
      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        e.issues.forEach((err) => {
          const path = err.path[0] as keyof FormErrors;
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      }

      return false;
    }
  };

  const OnSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm(userData)) return;

    const formData = new FormData(event.target);
    startTransition(() => {
      signUp(formData);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (stateIn?.success) {
      const setUser = userStore.getState().setAuth;
      setUser(stateIn?.user);
      redirect("/");
    }
  }, [stateIn]);

  return (
    <div className="flex h-[90vh] w-full flex-col items-center justify-center">
      <div className="flex flex-col gap-5 rounded-3xl bg-white p-7">
        <h1 className="text-center text-3xl font-bold">Sign Up</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={OnSubmit}
        >
          <div>
            <label>Enter firstname</label>
            <Input
              value={userData.firstName}
              type="text"
              name="firstName"
              placeholder="firstname"
              onChange={handleChange}
            />
            <p className="text-sm text-red-500">{errors.firstName}</p>
          </div>
          <div>
            <label>Enter lastname</label>
            <Input
              value={userData.lastName}
              type="text"
              name="lastName"
              placeholder="lastname"
              onChange={handleChange}
            />
            <p className="text-sm text-red-500">{errors.lastName}</p>
          </div>
          <div>
            <label>Enter username</label>
            <Input
              value={userData.username}
              type="text"
              name="username"
              placeholder="username"
              onChange={handleChange}
            />
            <p className="text-sm text-red-500">{errors.username}</p>
          </div>
          <div>
            <label>Enter email</label>
            <Input
              value={userData.email}
              type="email"
              name="email"
              placeholder="email"
              onChange={handleChange}
            />
            <p className="text-sm text-red-500">{errors.email}</p>
          </div>
          <div>
            <label>Enter phone</label>
            <Input
              value={userData.phone}
              type="text"
              name="phone"
              placeholder="phone"
              onChange={handleChange}
            />
            <p className="text-sm text-red-500">{errors.phone}</p>
          </div>
          <div>
            <label>Enter main address</label>
            <Input
              value={userData.address}
              type="text"
              name="address"
              placeholder="address"
              onChange={handleChange}
            />
            <p className="text-sm text-red-500">{errors.phone}</p>
          </div>
          <div>
            <label>Enter password</label>
            <Input
              value={userData.password}
              type="password"
              name="password"
              placeholder="password"
              onChange={handleChange}
            />
            <p className="text-sm text-red-500">{errors.password}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Button
              size="normal"
              type="submit"
              disabled={isPending}
            >
              Sign Up
            </Button>
            <p className="text-center text-sm text-red-500">{stateIn?.message}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
