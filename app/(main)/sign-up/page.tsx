"use client";

import { useActionState, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { SignUpAction } from "@/lib/actions";
import { userStore } from "@/lib/store/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUp() {
  const [stateIn, signUp, isPending] = useActionState(SignUpAction, null);
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
  });

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
        <h1 className="text-center text-3xl font-bold">Sign In</h1>
        <form
          className="flex flex-col gap-4"
          action={signUp}
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
          </div>
          <Button
            size="normal"
            type="submit"
            disabled={isPending}
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
