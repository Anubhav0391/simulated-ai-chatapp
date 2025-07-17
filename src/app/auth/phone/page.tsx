"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import PhoneInput from "./PhoneInput";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";

const schema = z.object({
  phone: z
    .string()
    .trim()
    .nonempty("Phone number is required")
    .regex(/^[0-9]+$/, "Only digits allowed")
    .min(6, "Phone number too short"),
});

type FormData = z.infer<typeof schema>;

const PhoneAuthPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { sendOtp } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    console.log(data); // make api call with countryCode + phone to get otp

    setTimeout(() => {
      sendOtp();
      setLoading(false);
      router.push("/auth/verify");
    }, 1000);
  };

  return (
    <div className="h-full flex items-center justify-center">
      <Card className="sm:p-6 p-4 sm:w-lg w-[95%]">
        <h1 className="text-3xl font-semibold">Get Started</h1>
        <p className="-mt-5 mb-5">Enter your phone number to continue</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="sm:space-y-6 space-y-4"
        >
          <PhoneInput
            name="phone"
            register={register}
            error={errors.phone?.message}
            defaultDial={"+91"}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PhoneAuthPage;
