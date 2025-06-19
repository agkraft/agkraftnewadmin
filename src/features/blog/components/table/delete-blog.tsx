// import ReCAPTCHA from "react-google-recaptcha";
// import {
//     AlertDialog,
//     AlertDialogContent,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { useDeleteBlog } from "../../api/mutation";



// interface categoryType {
//     id: number | null | undefined;
//     setClose: React.Dispatch<React.SetStateAction<boolean>>
// }

// export const DeleteBlog = ({ id, setClose }: categoryType) => {
//     console.log(id);

//     const [open, setOpen] = useState(false);
//     const deleteBlogMutate = useDeleteBlog();

//     useEffect(()=> {
//         if(deleteBlogMutate.isSuccess){
//             setOpen(false);
//             setClose(false);
//         }
//     }, [deleteBlogMutate.isSuccess, setClose]);
//     return (
//         <AlertDialog open={open} onOpenChange={setOpen}>
//             <AlertDialogTrigger asChild={true} onClick={() => setOpen(true)}>
//                 <Button size={'lg'} className="bg-[#68473B] hover:bg-[#68473B] rounded-md text-white">Delete</Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//                 <AlertDialogHeader>
//                     <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                     <ReCAPTCHA
//                         sitekey="YOUR_SITE_KEY"

//                     />
//                 </AlertDialogHeader>
//                 <AlertDialogFooter >
//                     <Button size={'lg'} className="bg-[#68473B] hover:bg-[#68473B]"
//                         onClick={
//                             () => {
//                                 deleteBlogMutate.mutate(id);
//                             }
//                         }
//                     >
//                         Delete
//                     </Button>
//                     <Button size={'lg'} className="bg-[#68473B] " onClick={() => setOpen(false)}>Cancel</Button>

//                 </AlertDialogFooter>
//             </AlertDialogContent>
//         </AlertDialog >
//     );
// };