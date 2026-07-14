import { useState } from "react";
import { Input } from "./ui/input";

interface NumberInputProps {
  value: number;
  onBlur: (value: number) => void;
  className?: string;
}

export function NumberInput({ value, onBlur, className }: NumberInputProps) {
  const [text, setText] = useState(String(value));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);

    if (isNaN(value)) return;

    setText(String(value));
  }

  return (
    <Input
      type="number"
      value={text}
      onChange={handleChange}
      onBlur={(e) => onBlur(Number(e.target.value))}
      className={className}
    />
  );
}
