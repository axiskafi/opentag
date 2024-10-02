"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import myAxios from "@/lib/axios.config";
import { REGISTER_URL } from "@/lib/apiEndPoints";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";

export default function Register() {
  const [authState, setAuthState] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: [],
    email: [],
    password: [],
    username: [],
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    myAxios
      .post(REGISTER_URL, authState)
      .then((res) => {
        setLoading(false);
        const reponse = res.data;

        toast.success("Account Created Successfully! we are logging you");
        if (reponse.status === 200) {
          signIn("credentials", {
            email: authState.email,
            password: authState.password,
            redirect: true,
            callbackUrl: "/",
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.status === 422) {
          setErrors(err.response?.data.errors);
        } else {
          toast.error("Something went wrong, please try again");
        }
      });
  };
  return (
    <div>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Welcome to OpenTag</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <form onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Label htmlFor="name">name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={authState.name}
                  onChange={(e) =>
                    setAuthState({ ...authState, name: e.target.value })
                  }
                />
                <span className="text-red-500">{errors?.name?.[0]}</span>
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">User Name</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="User Name"
                  value={authState.username}
                  onChange={(e) =>
                    setAuthState({ ...authState, username: e.target.value })
                  }
                />
                <span className="text-red-500">{errors?.username?.[0]}</span>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@email.com"
                  value={authState.email}
                  onChange={(e) =>
                    setAuthState({ ...authState, email: e.target.value })
                  }
                />
                <span className="text-red-500">{errors?.email?.[0]}</span>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="*****"
                  value={authState.password}
                  onChange={(e) =>
                    setAuthState({ ...authState, password: e.target.value })
                  }
                />
                <span className="text-red-500">{errors?.password?.[0]}</span>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  placeholder="*****"
                  value={authState.password_confirmation}
                  onChange={(e) =>
                    setAuthState({
                      ...authState,
                      password_confirmation: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mt-2">
                <Button disabled={loading} className="w-full">
                  {loading ? "Processing ...." : "Register"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}
