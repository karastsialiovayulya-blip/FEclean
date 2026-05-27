"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignUpCleanerAction } from "@/lib/api/actions/auth";
import { registrUser } from "@/lib/model";
import { userStore } from "@/lib/store/userStore";

interface CleanerRegData {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  rating: string;
  experience: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  rating?: string;
  experience?: string;
}

const cleanerRegistrationSchema = registrUser.extend({
  phone: z.string().trim().min(1, "Phone is required"),
  rating: z.coerce.number().min(0, "Rating must be 0 or higher").max(5, "Rating cannot exceed 5"),
  experience: z.coerce.number().min(0, "Experience must be 0 or higher"),
});

export default function SignUpCleanerPage() {
  const [stateIn, signUp, isPending] = useActionState(SignUpCleanerAction, null);
  const [userData, setUserData] = useState<CleanerRegData>({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    rating: "",
    experience: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (formData: CleanerRegData) => {
    try {
      cleanerRegistrationSchema.parse(formData);
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

    const formData = new FormData(event.currentTarget);
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
    <div className="flex min-h-[90vh] w-full flex-col items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-xl flex-col gap-5 rounded-3xl bg-white p-7">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold">Cleaner Sign Up</h1>
          <p className="text-sm text-gray-500">Create your cleaner profile and start accepting jobs.</p>
        </div>
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
            <label>Enter rating</label>
            <Input
              value={userData.rating}
              type="number"
              name="rating"
              placeholder="4.9"
              step="0.1"
              min="0"
              max="5"
              onChange={handleChange}
            />
            <p className="text-sm text-red-500">{errors.rating}</p>
          </div>
          <div>
            <label>Enter experience in years</label>
            <Input
              value={userData.experience}
              type="number"
              name="experience"
              placeholder="3"
              step="0.1"
              min="0"
              onChange={handleChange}
            />
            <p className="text-sm text-red-500">{errors.experience}</p>
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
          <div className="flex flex-col gap-3">
            <Button
              size="normal"
              type="submit"
              disabled={isPending}
            >
              Create cleaner account
            </Button>
            <p className="text-center text-sm text-red-500">{stateIn?.message}</p>
            <p className="text-center text-sm text-gray-500">
              Looking for home cleaning instead?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-black underline"
              >
                Sign up as a customer
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
