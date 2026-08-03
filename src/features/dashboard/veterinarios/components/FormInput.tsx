import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={clsx(
          "h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400",
          "focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/20",
          error && "border-red-400 focus:border-red-400 focus:ring-red-200",
          props.disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      />
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;