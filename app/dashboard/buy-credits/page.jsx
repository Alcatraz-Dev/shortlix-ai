"use client";
import React, { useState, useEffect, useContext } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { db } from "configs/db";
import { UserDetailContext } from "app/_context/UserDetailContext";
import { Users } from "configs/schema";
import { eq } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import CustomBuy from "./_components/CustomBuy";

function BuyCredits() {
  const { user } = useUser(); // Get user information
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [isSubscribed, setIsSubscribed] = useState(
    userDetail?.subscription || false
  );
  const [loading, setLoading] = useState(true);
  const [isSelectedOption, setIsSelectedOption] = useState(false);
  const [selectedCreditsOption, setSelectedCreditsOption] = useState(null);

  // Fetch user data if user is logged in
  useEffect(() => {
    if (user) {
      getUserDetail();
    }
  }, [user]);

  const getUserDetail = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

      // Assuming result returns an array, set the user details
      setUserDetail(result[0]);
      setIsSubscribed(result[0]?.subscription); // Update isSubscribed state
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeSubscription = async () => {
    setLoading(true);
    try {
      const result = await db
        .update(Users)
        .set({ subscription: true })
        .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

      console.log("Updated user subscription:", result);

      // Update context and state
      setIsSubscribed(true);
      setUserDetail((prev) => ({ ...prev, subscription: true }));

      // Show success toast
      toast.success("Subscription upgraded successfully!");
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      toast.error("Failed to upgrade subscription");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseCredits = async (amount) => {
    setLoading(true);
    try {
      // Updating credits in the database
      const result = await db
        .update(Users)
        .set({ credits: userDetail.credits + amount })
        .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

      console.log("Updated user credits:", result); // Debug log

      // Update user detail in context
      setUserDetail((prev) => ({
        ...prev,
        credits: prev.credits + amount, // Add the purchased amount to credits
      }));

      toast.success(`${amount} credits purchased successfully!`);
      handleUpgradeSubscription();
    } catch (error) {
      console.error("Error purchasing credits:", error);
      toast.error("Failed to purchase credits");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedCreditsOption(option);
    setIsSelectedOption(true); // Open the dialog
  };

  if (loading) return <p>Loading...</p>;

  const creditsOption = [
    { id: 1, amount: 2.99, credits: 30 },
    { id: 2, amount: 4.99, credits: 70 },
    { id: 3, amount: 9.99, credits: 150 },
    { id: 4, amount: 14.99, credits: 300 },
    { id: 5, amount: 29.99, credits: 750 },
    { id: 6, amount: 49.99, credits: 1500 },
    { id: 7, amount: 99.99, credits: 3500 },
  ];

  return (
    <div className="p-4">
      <h2 className="font-bold text-3xl text-primary">Buy Credits</h2>
      <p className="text-gray-400 mt-3 font-semibold">
        Current Credits:{" "}
        <span className="text-white">{userDetail?.credits || 0}</span>
      </p>
      <p className="text-gray-400 mt-3 font-semibold">
        You can generate:{" "}
        <span className="text-white">
          {Math.floor((userDetail?.credits || 0) / 10)}
        </span>{" "}
        video(s) with your current credits.
      </p>
      <p className="text-gray-400 mt-3 font-semibold">
        You can generate:{" "}
        <span className="text-white">{userDetail?.credits || 0}</span> voice(s)
        with your current credits.
      </p>
      <p className="text-gray-400 mt-3 font-semibold">
        Subscription Status:{" "}
        <span
          className={`animate-pulse ${
            isSubscribed ? "text-green-500" : "text-red-500"
          }`}
        >
          {userDetail?.subscription ? "Active" : "Inactive"}
        </span>
      </p>

      <h3 className="font-bold text-lg my-5">Buy More Credits</h3>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3 ">
        {creditsOption.map((option) => {
          const costPerCredit = (option.amount / option.credits).toFixed(3);

          return (
            <Card
              onClick={() => handleOptionSelect(option)} // Pass the option directly
              key={option.id}
              className={`bg-neutral-900 hover:cursor-pointer hover:scale-105 transition-all duration-300 hover:border-primary ${
                isSelectedOption === option.id ? "border-primary border-2" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="mt-5 mb-10 text-center font-bold text-2xl ">
                  Add {option.credits} Credits
                </CardTitle>
                <CardDescription className="mt-10 text-center">
                  Purchase {option.credits} credits for {`$${option.amount}`}.
                  <div className="flex flex-row items-center justify-center mt-14 gap-2">
                    <Image
                      src={"/coin.png"}
                      alt="coin"
                      width={50}
                      height={50}
                    />
                    <h2 className="text-3xl font-bold text-white drop-shadow-xl">
                      {option.credits}
                    </h2>
                  </div>
                  <p className="text-center mt-5">
                    This will allow you to generate{" "}
                    <strong className="text-primary">
                      {Math.floor(option.credits / 10)}
                    </strong>{" "}
                    video(s) and{" "}
                    <strong className="text-primary">{option.credits}</strong>{" "}
                    voice(s).
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent className="my-5 "></CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500">
                  For ${option.amount} (~${costPerCredit} per credit)
                </p>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <CustomBuy
        isSelected={isSelectedOption}
        setIsSelected={setIsSelectedOption}
        title="Buy Credits"
        message={`You are about to purchase ${selectedCreditsOption?.credits} credits for $${selectedCreditsOption?.amount}.`}
        creditsOption={selectedCreditsOption}
        handlePurchaseCredits={handlePurchaseCredits} // Pass this function from parent
      />
    </div>
  );
}

export default BuyCredits;
