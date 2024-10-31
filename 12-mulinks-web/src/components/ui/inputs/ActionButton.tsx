import { Button } from "@/components/ui/button-card";
import { CheckIcon, SpinnerDots } from "../icons";
import { BaseButtonProps } from "@/components/ui/inputs/types";

export const ActionButton = ({
  text,
  loading,
  disabled,
  variant,
  onClick,
}: BaseButtonProps) => {
  const ButtonContent = () => {
    if (loading)
      return (
        <span className="flex flex-row items-center justify-center gap-2 text-nowrap">
          {text} <SpinnerDots />
        </span>
      );
    if (variant === "success")
      return (
        <span className="flex flex-row items-center justify-center gap-2 text-nowrap">
          {text}
          <CheckIcon />
        </span>
      );
    return text;
  };

  return (
    <Button onClick={() => onClick()} disabled={disabled} variant={variant}>
      <span className="min-w-0 truncate">
        <ButtonContent />
      </span>
    </Button>
  );
};
