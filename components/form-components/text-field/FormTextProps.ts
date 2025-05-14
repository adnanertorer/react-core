import type { OverridableStringUnion } from "@mui/types";
import type { TextFieldPropsSizeOverrides } from "@mui/material";
import type { ReactNode } from "react";

type OnChangeType =
((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) | ((value: string) => void);

export interface FormTextProps {
  label?: string;
  name: string;
  value?: string;
  onChange?: OnChangeType;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string | null;
  allErrors?: string[];
  type?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoFocus?: boolean;
  className?: string;
  helperText?: string;
  fullWidth?: boolean;
  size?: OverridableStringUnion<"small" | "medium", TextFieldPropsSizeOverrides>;
  variant?: "outlined" | "filled" | "standard";
  inputMode?: "text" | "numeric" | "decimal" | "email" | "search" | "tel" | "url";
  multiline?: boolean;
  rows?: number;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  debounceDelay?: 300;
  onDebouncedChange?: (value: string) => void;
  customValidator?: (value: string) => string | undefined;
  theme?: "light" | "dark";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  clearable?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  showErrorOnlyIfNotEmpty?: boolean;
}
