import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link as LinkIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Image from "next/image";
import { isValidUrl } from "@/lib/utils";
import axios from "axios";
import { toast } from "react-toastify";
import myAxios from "@/lib/axios.config";
import { POST_URL } from "@/lib/apiEndPoints";
import { useSession } from "next-auth/react";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";
export default function AddPost() {
  const { data } = useSession();
  const user: CustomUser = data?.user as CustomUser;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postState, setPostState] = useState<PostStateType>({
    url: "",
    image_url: "",
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    title: [],
    url: [],
    description: [],
  });
  const loadPreview = async () => {
    if (postState?.url && isValidUrl(postState.url!)) {
      setLoading(true);
      axios
        .post("/api/image-preview", { url: postState.url })
        .then((res) => {
          setLoading(false);
          const resData: ImagePreviewResType = res.data?.data;
          console.log();
          const image =
            resData?.images && resData.images.length > 0
              ? resData.images[0]
              : "https://unsplash.com/photos/a-group-of-people-putting-their-hands-together-around-a-globe-9TKqGykJahM";
          console.log(image);
          setPostState({
            ...postState,
            image_url: image,
            title: resData.title,
            description: resData.description ? resData.description : "",
          });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          toast.error("Something went wrong with your url");
        });
    }
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    myAxios
      .post(POST_URL, postState, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const resData = res.data;
        setLoading(false);
        setOpen(false);
        setPostState({});
        toast.success("Post Added Successfully");
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="flex space-x-3 items-center mb-4"
          onClick={() => setOpen(true)}
        >
          <LinkIcon className="w-5 h-5" />
          <p>Submit Article</p>
        </div>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="overflow-y-scroll max-h-screen"
      >
        <DialogHeader>
          <DialogTitle>Add Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {postState.image_url && (
            <Image
              src={postState.image_url}
              width={450}
              height={450}
              alt="Image"
              className="object-contain w-full rounded-xl my-2"
            />
          )}
          <div className="mb-4">
            <Label htmlFor="url">URL</Label>
            <Input
              type="text"
              id="url"
              placeholder="Type your URL here..."
              value={postState.url || ""}
              onChange={(e) =>
                setPostState({ ...postState, url: e.target.value })
              }
              onBlur={() => loadPreview()}
            />
            <span className="text-red-500">{errors?.url?.[0]}</span>
          </div>
          <div className="mb-4">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              placeholder="Type your Title here..."
              value={postState.title || ""}
              onChange={(e) =>
                setPostState({ ...postState, title: e.target.value })
              }
            />
            <span className="text-red-500">{errors?.title?.[0]}</span>
          </div>
          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Type your Title here..."
              value={postState.description || ""}
              rows={10}
              onChange={(e) =>
                setPostState({ ...postState, description: e.target.value })
              }
            ></Textarea>
          </div>
          <div className="mb-4">
            <Button className="w-full" disabled={loading}>
              {loading ? "Processing ..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
