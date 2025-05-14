import { createContext } from "react";
import type { AuthContextType } from "../models/AuthContextType";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);