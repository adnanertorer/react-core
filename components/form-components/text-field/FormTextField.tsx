import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { FormTextProps } from "./FormTextProps";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { FormHelperText } from "@mui/material";

export const FormTextField: React.FC<FormTextProps> = ({
  label,
  name,
  value = "",
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  required = false,
  error,
  allErrors,
  type = "text",
  maxLength,
  minLength,
  pattern,
  autoFocus,
  className = "",
  helperText,
  fullWidth = false,
  size = "medium",
  variant = "outlined",
  inputMode,
  multiline = false,
  rows = 3,
  startAdornment,
  endAdornment,
  onBlur,
  onFocus,
  debounceDelay = 300,
  onDebouncedChange,
  customValidator,
  theme = "light",
  startIcon,
  endIcon,
  clearable = false,
  showErrorOnlyIfNotEmpty,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [internalError, setInternalError] = useState<string | null | undefined>(
    error
  );
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    setInternalError(error);
  }, [error]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    if (typeof onChange === "function") {
      if (onChange.length === 1 && typeof newValue === "string") {
        (onChange as (value: string) => void)(newValue);
      } else {
        (
          onChange as (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => void
        )(e);
      }
    }

    if (customValidator) {
      const validationError = customValidator(newValue);
      setInternalError(validationError);
    }

    if (onDebouncedChange) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        onDebouncedChange(newValue);
      }, debounceDelay);
    }
  };

  const handleClear = () => {
    const event = {
      target: {
        name,
        value: "",
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  const isEmpty =
    internalValue === null ||
    internalValue === undefined ||
    internalValue === "" ||
    (Array.isArray(internalValue) && internalValue.length === 0);

  const shouldShow = !showErrorOnlyIfNotEmpty || !isEmpty;

  const displayedError = shouldShow ? error || internalError : null;

  return (
    <div
      className=""
    >
      <TextField style={{ display: type === "hidden" ? "none" : undefined }}
        name={name}
        label={label}
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        error={Boolean(displayedError)}
        helperText={displayedError || helperText}
        type={type}
        inputProps={{
          maxLength,
          minLength,
          pattern,
          inputMode,
          readOnly,
        }}
        autoFocus={autoFocus}
        fullWidth={fullWidth}
        size={size}
        variant={variant}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        onBlur={onBlur}
        onFocus={onFocus}
        className={`${theme === "dark" ? "mui-dark-theme" : ""} ${className}`}
        InputProps={{
          startAdornment: (startAdornment || startIcon) && (
            <InputAdornment position="start">
              {startAdornment || startIcon}
            </InputAdornment>
          ),
          endAdornment: (clearable || endAdornment || endIcon) && (
            <InputAdornment position="end">
              <div style={{ display: "flex", alignItems: "center" }}>
                {endAdornment || endIcon}
                {clearable && internalValue && (
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    style={{ marginLeft: 4 }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </InputAdornment>
          ),
        }}
      />
      {allErrors && allErrors.length > 1 && shouldShow && (
        <FormHelperText error component="div">
          <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
            {allErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </FormHelperText>
      )}
    </div>
  );
};
