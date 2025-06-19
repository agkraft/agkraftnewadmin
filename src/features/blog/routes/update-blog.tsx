import { useState } from "react";
import { FaRectangleList } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


const languageSchema = z.object({
  title: z.string().nonempty("title name is required"),
  code: z.string().nonempty("Code is required"),
  status: z.boolean(),
});

export const UpdateBlog = () => {
  const [open, setOpen] = useState(false);
  const {
    formState: { errors },
  } = useForm({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      title: "",
      description: "",
      status: false,
    },
  });


  const handleDialogOpen = () => {
    setOpen(true);
    // refetch().then((data) => {
    //   const { name, code, status } = data.data?.data.data;
    //   setValue("name", name);
    //   setValue("code", code);
    //   setValue("status", status);
    // });
  };

  //   if (error) {
  //     console.log(error);
  //   }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger onClick={handleDialogOpen}>
          <div>
            <FaRectangleList className="w-6 h-6 text-[#ee6620]" />
          </div>
        </DialogTrigger>
        <DialogContent>
          <div className="flex flex-row justify-between">
            <DialogTitle className="text-[24px] text-[#ee6620]">
              Update Blog
            </DialogTitle>
          </div>
          <div className="flex flex-col gap-4 max-h-[700px] px-3">
            {/* Character */}
            <div className="mt-5 relative">
              <input
                type="text"
                id="title"
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                // value={title}
                placeholder=" "
                // onChange={handleInputChange(setName, "name")}
                required
              />
              <label
                className="absolute top-2 left-2 pointer-events-none text-[#ee6620]"
                htmlFor="character"
              >
                title
              </label>
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Character Code */}
            <div className="mt-5 relative">
              <input
                type="text"
                id="code"
                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                // value={code}
                placeholder=" "
                // onChange={handleInputChange(setCode, "code")}
                required
              />
              <label
                className="absolute top-2 left-2 pointer-events-none text-[#ee6620]"
                htmlFor="code"
              >
                description
              </label>
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="status flex justify-between mt-5">
              <label htmlFor="characterstatus">Status</label>
              <Switch
                // checked={status || false}
                id="characterstatus"
                // onCheckedChange={(value) => setStatus(value)}
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col relative mt-5">
              <div className="w-full">
                {/* <Input
                  display={true}
                  id="picture"
                  className="text-[#68473B]"
                  type="file"
                /> */}
              </div>
              {/* <div className="mt-2">
                <div className="text-[#68473B]">
                  Image Preview
                </div>
                <div className="flex flex-wrap">
                  {image || previewUrl ? (
                    <div style={{ margin: "5px" }}>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed flex justify-center items-center mt-2">
                      <img src={image || ""} alt="image" className="p-10" />
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image}</p>
                )}
              </div> */}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                size={"lg"}
                variant={"agkraft"}
                // onClick={handleSubmit}
                className="cursor-pointer"
              >
                Update
              </Button>
              <Button
                size={"lg"}
                variant={"agkraft"}
                // onClick={() => setDeleteModal(true)}
                className="cursor-pointer"
                // disabled={updataCharacterMutation.isPending}
              >
                Delete
              </Button>
              <Button
                size={"lg"}
                variant={"agkraft"}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
                // disabled={updataCharacterMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
