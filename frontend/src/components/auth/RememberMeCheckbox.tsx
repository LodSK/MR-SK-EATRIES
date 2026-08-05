import { Checkbox } from "@/components/ui/checkbox";

interface RememberMeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function RememberMeCheckbox({ checked, onChange }: RememberMeCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} />
      Remember me
    </label>
  );
}
