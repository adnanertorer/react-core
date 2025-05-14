import { useState } from "react";
import { useDebouncedForFunc } from "./useDebouncedForFunc";

type Validator<T> = (value: string | number | boolean , form: T) => string | null;
type ValidationSchema<T> = { [K in keyof T]?: Validator<T>[] }; // T tipideki objenin yani formun tüm propertylerini tek tek gezerek
//K değerine atama yapar. Tıpkı bir foreach gibi dusunulebilir. Opsiyoneldir, her alan icin calismak zorunda degil.
//Validator<T>[] ile her property icin birden fazla validator ekleyebilir.


export function useFormManager<T>(initialForm: T, schema: ValidationSchema<T>) {
  const [form, setForm] = useState<T>(initialForm);
  const [isValid, setIsValid] = useState(true);
  const [errors, seteErrors] = useState<Partial<Record<keyof T, string[]>>>({}); // Partial sarmaladigi tum propertyleri opsiyonel yapar.
  //Record<keyof T, string[]> T olarak verilen obje icindeki tum propertyleri string tip olarak ata, cunku donen mesaj string olacak
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof T, boolean>>
  >({});

  const setFieldValue = <K extends keyof T>(field: K, value: T[K]) => {
    // <K extends keyof T> verilen K degeri mutlaka T ye ait olma zorunlulugu (type-safe)
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  useDebouncedForFunc(
    () => {
      if (Object.values(touchedFields).some(Boolean)) {
        validate();
      }
    },
    [form],
    300
  );

  const validate = () => {
    const currentErrors: Partial<Record<keyof T, string[]>> = {};

    for (const key in schema) {
      if (!touchedFields[key as keyof T]) continue;

      const validators = schema[key];
      if (!validators) continue;

      const fieldErrors: string[] = [];

      for (const validator of validators) {
        const result = validator(form[key] as string | number | boolean, form);
        if (result) {
          fieldErrors.push(result);
        }
      }

      if (fieldErrors.length > 0) {
        currentErrors[key as keyof T] = fieldErrors;
      }
    }

    seteErrors(currentErrors);
    const isValidNow = Object.keys(currentErrors).length === 0;
    setIsValid(isValidNow);
    return isValidNow;
  };

  return {
    form,
    setForm,
    setFieldValue,
    validate,
    errors,
    getFieldErrors: (field: keyof T) => errors[field] ?? [],
    getFirstError: (field: keyof T) => errors[field]?.[0] ?? null,
    isValid,
    reset: () => {
      setForm(initialForm);
      seteErrors({});
      setTouchedFields({});
    },
  };
}
