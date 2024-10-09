import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader } from "lucide-react";


function CustomLoading({ loading, title, message }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent className="bg-neutral-800 border-primary rounded-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Your {title} is being generated !</AlertDialogTitle>
          <AlertDialogDescription>
            Please hold tight while we process your request. This might take a
            few moments, but the result will be worth the wait !
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center justify-center space-x-2">
          <div className="flex flex-row justify-center items-center gap-2">
            <Loader className="text-center mt-1 h-4 w-4 animate-spin text-primary" />
            <span className="text-primary">{message}</span>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CustomLoading;
