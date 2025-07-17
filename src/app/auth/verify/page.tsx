"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { Input } from "../../components/ui/input";
import { toast } from "react-toastify";

const schema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^[0-9]+$/, "Only digits allowed"),
});

type FormData = z.infer<typeof schema>;

export default function VerifyOtpPage() {
  const [loading, setLoading] = useState(false);
  const { login, otp } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      
      if (otp === data.otp) {
        login();
        toast.success("OTP verified successfuly");
        router.push("/");
      } else {
        setError("otp", {
          type: "manual",
          message: "Invalid OTP. Please try again.",
        });
      }
    }, 1000);
  };

  if (!otp) router.push("/auth/phone");
  console.log({ otp });

  return (
    <div className="h-full flex items-center justify-center">
      <Card className="sm:p-6 p-4 sm:w-lg w-[95%]">
        <h1 className="text-3xl font-semibold">Verify OTP</h1>
        <p className="-mt-5 mb-5">Enter the 6-digit code sent to your phone</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="sm:space-y-6 space-y-4"
        >
          <div>
            <label className="block text-base font-medium mb-1">OTP</label>
            <Input
              type="text"
              maxLength={6}
              inputMode="numeric"
              {...register("otp")}
              className=""
              placeholder="Enter OTP"
              onInput={(e) =>
                (e.currentTarget.value = e.currentTarget.value.replace(
                  /\D/g,
                  ""
                ))
              }
            />
            {errors.otp && (
              <p className="text-destructive text-base mt-0.5">
                {errors.otp.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Verify"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
