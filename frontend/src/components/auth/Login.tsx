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
import { CHECK_CREDENTIALS, LOGIN_URL } from "@/lib/apiEndPoints";
import { toast } from "react-toastify";
import myAxios from "@/lib/axios.config";
import { signIn } from "next-auth/react";
export default function Login() {
  const [authState, setAuthState] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: [],
    password: [],
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    myAxios
      .post(CHECK_CREDENTIALS, authState)
      .then((res) => {
        setLoading(false);
        const resData = res.data;
        if (resData.status === 200) {
          signIn("credentials", {
            email: authState.email,
            password: authState.password,
            redirect: true,
            callbackUrl: "/",
          });
        }
        toast.success("Logged in Successfully!");
      })
      .catch((err) => {
        setLoading(false);
        if (err.resData?.status === 422) {
          setErrors(err.resData?.data.errors);
        } else if (err.resData?.status === 401) {
          toast.error("Invalid Credentials");
        } else {
          toast.error("Something went wrong, please try again");
        }
      });
  };
  return (
    <div>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Welcome to OpenTag</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <form onSubmit={handleSubmit}>
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
              <div className="mt-2">
                <Button disabled={loading} className="w-full">
                  {loading ? "Processing ...." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}
