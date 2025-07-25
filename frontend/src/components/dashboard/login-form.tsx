"use client";

import { BikeIcon, PizzaIcon } from "@frontend/components/common/icons";
import { login } from "@frontend/lib/actions";
import { Spinner } from "@medusajs/icons";
import { Badge, Button, Input, Label, Select } from "@medusajs/ui";
import { Link } from "next-view-transitions";
import { useActionState, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

function Submit() {
  const status = useFormStatus();

  return (
    <Button
      type="submit"
      size="large"
      className="self-end"
      isLoading={status.pending}
    >
      Login
    </Button>
  );
}

function DefaultLoginForm() {
  const [state, action] = useActionState(login, {message: ""});

  return (
    <form action={action} className="flex flex-col gap-4 max-w-96">
      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="Email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" />
        </div>
        <div>
          <Label htmlFor="actor_type">I&apos;m a...</Label>
          <Select name="actor_type">
            <Select.Trigger>
              <Select.Value></Select.Value>
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="restaurant">Restaurant</Select.Item>
              <Select.Item value="driver">Driver</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <Link href="/signup">
          <Button variant="transparent" size="large">
            Create account
          </Button>
        </Link>
        <Submit />
      </div>
      {state?.message && (
        <Badge className="justify-center text-center">{state.message}</Badge>
      )}
    </form>
  );
}

function DemoLoginForm() {
  const [isLoading, setIsLoading] = useState({
    restaurant: false,
    driver: false,
  });

  const loginAs = async (actor_type: "restaurant" | "driver") => {
    setIsLoading((prev) => ({...prev, [actor_type]: true}));
    const credentials = new FormData();
    credentials.set("email", `${actor_type}@account.com`);
    credentials.set("password", "123");
    credentials.set("actor_type", actor_type);
    await login({}, credentials).catch(console.error);
  };

  return (
    <div className="flex flex-col gap-3 justify-center items-center">
      <Button size="xlarge" onClick={() => loginAs("restaurant")}>
        {isLoading.restaurant ? (
          <Spinner className="animate-spin" />
        ) : (
          <PizzaIcon />
        )}
        Log in as a Restaurant
      </Button>
      <Button size="xlarge" onClick={() => loginAs("driver")}>
        {isLoading.driver ? <Spinner className="animate-spin" /> : <BikeIcon />}
        Log in as a Driver
      </Button>
    </div>
  );
}

export function LoginForm() {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true" ? (
    <DemoLoginForm />
  ) : (
    <DefaultLoginForm />
  );
}
