import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PayPalButtons } from "@paypal/react-paypal-js";
import VisuallyHidden from "app/VisuallyHidden";

function CustomBuy({
  isSelected,
  setIsSelected,
  title,
  message,
  creditsOption, // Make sure creditsOption is passed properly
  handlePurchaseCredits, // Pass this function as a prop from the parent component
}) {
  const handleCreateOrder = (data, actions) => {
    if (!creditsOption) {
      console.error("No credits option selected.");
      return Promise.reject(new Error("No credits option selected."));
    }

    return actions.order.create({
      purchase_units: [
        {
          description: `Purchase of ${creditsOption?.credits} credits`,
          amount: {
            value: creditsOption.amount.toFixed(2), // Ensure this is correctly formatted
          },
        },
      ],
    });
  };

  const handleOnApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      if (details.status === "COMPLETED") {
        // Call the function to update credits after successful payment
        await handlePurchaseCredits(creditsOption?.credits); // Use creditsOption

        // Show success message
        alert(`Transaction completed by ${details.payer.name.given_name}`);

        // Close the dialog after successful payment
        setIsSelected(false);
      } else {
        alert("Transaction failed. Please try again.");
      }
    });
  };

  return (
    <Dialog open={isSelected} onOpenChange={() => setIsSelected(!isSelected)}>
      <DialogContent className="bg-slate-50 text-black border-primary rounded-md mx-auto py-5 w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-black font-bold text-2xl" >
            {title}
            </DialogTitle>
          <DialogDescription className="text-gray-600 font-semibold">
            {message}
          </DialogDescription>
        </DialogHeader>

        <PayPalButtons
          className="my-10 gap-2"
          style={{ layout: "vertical", backgroundColor: "black" }}
          createOrder={handleCreateOrder} // Moved to a separate function
          onApprove={handleOnApprove} // Moved to a separate function
          onError={(err) => {
            console.error("PayPal transaction error:", err);
            alert("Failed to complete the transaction. Please try again.");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CustomBuy;