import clsx from "clsx";
import type { PropsWithChildren } from "react";

export const Button = ({
  onClick,
  disabled,
  variant = "default",
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  variant?: "success" | "error" | "default";
} & PropsWithChildren) => {
  return (
    <button
      className={clsx(
        "flex w-full items-center justify-center text-nowrap rounded-button px-4 py-3 text-text font-semibold transition-colors motion-reduce:transition-none",
        {
          "bg-buttonDisabled text-textButtonDisabled":
            disabled && variant !== "success",
          "bg-button text-textButton hover:bg-buttonHover":
            !disabled && variant !== "success",
          "bg-buttonSuccess text-textButtonSuccess": variant === "success", // success is likely to be always disabled
        }
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
