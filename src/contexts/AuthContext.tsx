"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/data/mockData";
import { users } from "@/data/mockData";

interface AuthContextType {
    user: User | null;
    login: (email: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check if user is logged in from localStorage
        const savedUserEmail = localStorage.getItem("userEmail");
        if (savedUserEmail) {
            const foundUser = users.find(u => u.email === savedUserEmail);
            if (foundUser) {
                setUser(foundUser);
            }
        }
    }, []);

    const login = (email: string): boolean => {
        const foundUser = users.find(u => u.email === email);
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem("userEmail", email);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("userEmail");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
