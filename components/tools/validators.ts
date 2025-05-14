export const required = (message = "Bu alan zorunludur.") => (val: string | number | boolean) =>
    !val || val.toString().trim() === "" ? message : null;
  
  export const minLength = (min: number, message?: string) => (val: string) =>
    val.length < min ? message ?? `${min} karakterden kısa olamaz.` : null;

  export const maxLength = (max: number, message?: string) => (val: string) =>
    val.length > max ? message ?? `${max} karakterden uzun olamaz.` : null;
  
  export const isEmail = (message = "Geçerli bir email girin.") => (val: string) =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? message : null;