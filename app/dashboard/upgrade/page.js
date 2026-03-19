"use client";
import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

// ✅ Load Razorpay script dynamically
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function UpgradePlans() {
  const { user } = useUser();
  const userUpgradePlan = useMutation(api.user.userUpgradePlan);
  const getUserInfo = useQuery(api.user.getUserInfo, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  const handlePayment = async () => {
  const loaded = await loadRazorpay();
  if (!loaded) {
    toast.error("Failed to load payment system.");
    return;
  }

  const res = await fetch("/api/razorpay", { method: "POST" });
  const order = await res.json();

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: "AI PDF Note Taker",
    description: "Unlimited Plan",
    order_id: order.id,

    // ✅ Verify before upgrading
    handler: async function (response) {
      const verifyRes = await fetch("/api/razorpay", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      });

      const { verified } = await verifyRes.json();

      if (verified) {
        // ✅ Only upgrade if payment is genuinely verified
        await userUpgradePlan({
          userEmail: user?.primaryEmailAddress?.emailAddress,
        });
        toast.success("Plan Upgraded Successfully!");
      } else {
        toast.error("Payment verification failed. Contact support.");
      }
    },

    prefill: {
      email: user?.primaryEmailAddress?.emailAddress,
      name: user?.fullName,
    },
    theme: { color: "#000000" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
  

  return (
    <div>
      <h2 className="font-medium text-3xl">Plans</h2>
      <p className="text-gray-500 mb-8">Upload multiple PDFs and take unlimited notes</p>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
          
          {/* Unlimited Plan */}
          <div className="rounded-2xl p-6 shadow-md border sm:order-last sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">Unlimited</h2>
              <p className="mt-2">
                <strong className="text-3xl font-bold text-gray-900">₹1</strong>
                <span className="text-sm font-medium text-gray-700">/month</span>
              </p>
            </div>
            <ul className="mt-6 space-y-2">
              {["Unlimited PDF Upload", "Unlimited Notes Taking", "Email support", "Help center access"].map((item) => (
                <li key={item} className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              {!getUserInfo?.upgrade ? (
                <button
                  onClick={handlePayment}
                  className="w-full rounded-full border border-blue-600 bg-blue-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-blue-700"
                >
                  Upgrade Now
                </button>
              ) : (
                <div className="mt-4 block rounded-full border border-blue-600 bg-blue-600 px-12 py-3 text-center text-sm font-medium text-white">
                  Current Plan
                </div>
              )}
            </div>
          </div>

          {/* Free Plan */}
          <div className="rounded-2xl p-6 shadow-md border sm:order-first sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">Free</h2>
              <p className="mt-2">
                <strong className="text-3xl font-bold text-gray-900">₹0</strong>
                <span className="text-sm font-medium text-gray-700">/month</span>
              </p>
            </div>
            <ul className="mt-6 space-y-2">
              {["5 PDF Upload", "Unlimited Notes Taking", "Email support", "Help center access"].map((item) => (
                <li key={item} className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            {!getUserInfo?.upgrade ? (
              <div className="mt-8 block rounded-full border border-blue-600 bg-white px-12 py-3 text-center text-sm font-medium text-blue-600">
                Current Plan
              </div>
            ) : (
              <div className="mt-8 block rounded-full bg-slate-200 px-12 py-3 text-center text-sm font-medium text-slate-400 pointer-events-none cursor-not-allowed">
                Unavailable
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}