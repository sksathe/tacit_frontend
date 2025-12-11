"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Command } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!email.trim()) {
            setError("Please enter your email address");
            return;
        }

        const success = login(email.trim());
        if (success) {
            router.push("/");
        } else {
            setError("Invalid email address. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card/95 backdrop-blur-md border-border">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                            <Command className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight font-mono">Tacit</CardTitle>
                    </div>
                    <CardDescription className="text-center">
                        Sign in to create and manage your guides
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                required
                                autoFocus
                                className={error ? "border-destructive" : ""}
                            />
                            {error && (
                                <p className="text-sm text-destructive">{error}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                        >
                            Sign In
                        </Button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-xs text-muted-foreground">
                            Try: john@example.com or jane@example.com
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
