import React, { ReactNode } from "react";
import { Box } from "@mui/material";

type InputFieldProps = {
  id?: string;
  label?: string;
  extra?: string;
  placeholder?: string;
  variant?: string;
  state?: string;
  disabled?: boolean;
  type?: string;
  CustomComp?: ReactNode;
  LeftComp?: ReactNode;
  RightComp?: ReactNode;
  value?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function InputField({
  CustomComp,
  LeftComp,
  RightComp,
  label,
  id,
  extra,
  type,
  placeholder,
  variant,
  state,
  disabled,
  value,
  ...inputProps
}: InputFieldProps) {
  return (
    <div className={`${extra} w-full mt-4`}>
      <label
        htmlFor={id}
        className={`text-lg leading-7 text-[#2C2C2C] font-semibold mt-2 ml-2`}
      >
        {label}
      </label>

      <Box
        className={`mt-1  p-3 flex h-12 w-full items-center rounded-xl border text-black bg-white/0 overflow-hidden ${
          disabled === true
            ? "!border-red-500 !bg-red-500 dark:!bg-red-500/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
            : state === "error"
            ? "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
            : state === "success"
            ? "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400"
            : "border-gray-200 dark:!border-white/10 dark:text-white"
        }`}
      >
        {CustomComp ? (
          CustomComp
        ) : (
          <Box onDoubleClick={inputProps.onDoubleClick} className="flex flex-1 items-center justify-center h-full w-12">
            {LeftComp && LeftComp}
            <input
              disabled={disabled}
              type={type}
              id={id}
              placeholder={placeholder}
              className={`flex-1 text-black border border-black rounded-lg p-3 text-sm outline-none`}
              value={value}
              {...inputProps}
            />
            {RightComp && RightComp}
          </Box>
        )}
      </Box>
    </div>
  );
}

export default InputField;