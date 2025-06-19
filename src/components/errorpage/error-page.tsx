import { Button } from "../ui/button";

const ErrorPage = ({ error }: { error: any }) => {
  console.log(error); // Useful for debugging

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <img src="../../../public/500 Internal Server Error-bro.png" className="w-[500px] " alt=""  />
      <p>Something happened while fetching data ... </p>
      <p className="py-2">
        {error?.code === "ERR_NETWORK"
          ? error.message
          : error?.response?.data?.message || "An unknown error occurred."}
      </p>
      <Button variant={"primary"}  size={"lg"} onClick={() => window.location.reload()}>
        Reload
      </Button>
    </div>
  );
};

export default ErrorPage;