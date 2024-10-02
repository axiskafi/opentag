"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "../common/UserAvatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import myAxios from "@/lib/axios.config";
import { LOGOUT_URL, UPDATE_PROFILE } from "@/lib/apiEndPoints";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";
import { toast } from "react-toastify";
import { signOut, useSession } from "next-auth/react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import useLocalStorage from "@/lib/hooks/useLocalStorage";

export default function ProfileMenu() {
  const { data, update } = useSession();
  const user = data?.user as CustomUser;

  // const [logoutOpen, setLogoutOpen] = useLocalStorage<boolean>(
  //   "showLogout",
  //   false
  // );
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | boolean>(false);
  const [errors, setErrors] = useState({
    profile_image: [],
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("Selected", file);
    if (file) {
      setImage(file);
    }
  };
  const logoutUser = async () => {
    myAxios
      .post(
        LOGOUT_URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        signOut({
          callbackUrl: "/login",
          redirect: true,
        });
      })
      .catch((err) => {
        toast.error("Something Went wrong please try again");
      });
  };

  const updateProfile = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    if (image instanceof File) {
      formData.append("profile_image", image);
    }
    myAxios
      .post(UPDATE_PROFILE, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const resData = res.data;
        update({ profile_image: resData.image });
        toast.success(resData.message);
        setLoading(false);
        setProfileOpen(false);
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
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action expire current session.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4">
            <Button variant="destructive" onClick={logoutUser}>
              Yes Logout
            </Button>
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={updateProfile}>
            <div className="mb-2">
              <Label htmlFor="profile">Profile Images</Label>
              <Input
                type="file"
                className="file:text-white"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="mb-2">
              <Button className="w-full" disabled={loading}>
                {loading ? "Uploading ..." : "Update Profile"}
              </Button>
            </div>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          {user && <UserAvatar image={user?.profile_image ?? undefined} />}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setProfileOpen(true)}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLogoutOpen(true)}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
