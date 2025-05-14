"use client";

import {
  Autocomplete,
  CircularProgress,
  TextField,
} from "@mui/material";

interface AutocompleteInputProps<T> {
  label: string;
  value: T | null;
  onChange: (value: T | null) => void;
  options: { label: string; value: T }[];
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  noOptionsText?: string;
}

export function AutocompleteInput<T>({
  label,
  value,
  onChange,
  options,
  disabled = false,
  loading = false,
  placeholder = "Seçim yapın...",
  noOptionsText = "Seçenek bulunamadı",
}: AutocompleteInputProps<T>) {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      value={options.find((o) => o.value === value) || null}
      onChange={(_, newValue) => onChange(newValue ? newValue.value : null)}
      loading={loading}
      disabled={disabled}
      noOptionsText={noOptionsText}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
