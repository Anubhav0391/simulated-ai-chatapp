"use client";

import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "../../components/ui/select";
import { useAuthStore } from "@/store/auth";
import axios from "axios";
import { memo, useEffect, useState } from "react";
import { UseFormRegister } from "react-hook-form";

type Country = {
  name: string;
  code: string;
  dial: string;
};

interface PhoneInputProps {
  name: string;
  register: UseFormRegister<{ phone: string }>;
  error?: string;
  defaultDial?: string;
}

const PhoneInput = ({
  register,
  error,
  defaultDial = "+91",
}: PhoneInputProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const getDialCode = (idd: { root: string; suffixes?: string[] }) => {
    if (!idd?.root) return "";
    
    // assuming countries with idd.root +1 & +7 or with multiple idd.suffix will only include idd.root in code
    const isRootOnly =
      ["+1", "+7"].includes(idd.root) || (idd.suffixes?.length ?? 0) > 1;
    return isRootOnly ? idd.root : `${idd.root}${idd.suffixes?.[0] || ""}`;
  };
  const { countryCode, setCountryCode } = useAuthStore();

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=idd,name,cca2")
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: Country[] = data.data.reduce((acc: Country[], c: any) => {
          const dial = getDialCode(c.idd);
          if (dial) acc.push({ name: c.name.common, code: c.cca2, dial });
          return acc;
        }, []);

        const defaultCountry = mapped.find((c) => c.dial === defaultDial);
        setCountries(mapped.sort((a, b) => a.name.localeCompare(b.name)));

        if (defaultCountry) setCountryCode(defaultCountry.dial);
      });
  }, []);

  const handleChange = (value: string) => setCountryCode(value);

  return (
    <div>
      <label className="block text-base font-medium mb-1">Phone Number</label>
      <div className="flex shadow-xs rounded-md">
        <Select value={countryCode} onValueChange={handleChange}>
          <SelectTrigger className="rounded-r-none min-w-16 max-w-16 shadow-none">
            {countries.find((c) => c.dial === countryCode)?.code}
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.dial}>
                  {c.name} ({c.dial})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <p className=" dark:bg-input/30 border-input flex h-12 border-t border-b items-center px-2 bg-transparent  text-base md:text-sm">
          {countryCode}
        </p>
        <Input
          type="tel"
          onInput={(e) =>
            (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))
          }
          {...register("phone")}
          className=" rounded-l-none border-l-0 focus-visible:border-l-0 shadow-none"
        />
      </div>
      {error && <p className="text-destructive text-base mt-0.5">{error}</p>}
    </div>
  );
};

export default memo(PhoneInput);
