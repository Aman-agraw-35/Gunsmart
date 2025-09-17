"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./signup.css";

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (user.password !== user.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: user.username,
                    email: user.email,
                    password: user.password,
                }),
            });

            const data = await res.json();

            if (data.success) {
                router.push("/login");
            } else {
                setError(data.error || "Something went wrong");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1>Sign Up</h1>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={user.username}
                            onChange={(e) => setUser({...user, username: e.target.value})}
                            required
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email}
                            onChange={(e) => setUser({...user, email: e.target.value})}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={user.password}
                            onChange={(e) => setUser({...user, password: e.target.value})}
                            required
                            minLength={6}
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={user.confirmPassword}
                            onChange={(e) => setUser({...user, confirmPassword: e.target.value})}
                            required
                            minLength={6}
                            placeholder="Confirm your password"
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>
                <p className="login-link">
                    Already have an account? <Link href="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}