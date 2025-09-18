"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
        <div className="auth-page">
            <div className="auth-overlay">
                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="hidden md:flex flex-col bg-transparent items-start justify-center text-white px-6">
                        <h1 className="text-4xl font-extrabold bg-transparent mb-4">Join Gunsmart</h1>
                        <p className="text-lg bg-transparent  text-gray-100/90">Create an account to save your cart, checkout faster and manage orders.</p>
                        <p className="mt-6 bg-transparent  text-sm text-gray-200/80">Secure passwords, responsive UI and a smooth checkout experience.</p>
                    </div>
                    <div className="w-full  max-w-md mx-auto bg-white/95 rounded-xl shadow-xl p-6 md:p-8">
                        <div>
                            <h2 className="text-center text-2xl md:text-3xl font-extrabold text-gray-900">Create your account</h2>
                        </div>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your username"
                                value={user.username}
                                onChange={(e) => setUser({...user, username: e.target.value})}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your email"
                                value={user.email}
                                onChange={(e) => setUser({...user, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your password"
                                value={user.password}
                                onChange={(e) => setUser({...user, password: e.target.value})}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Confirm your password"
                                value={user.confirmPassword}
                                onChange={(e) => setUser({...user, confirmPassword: e.target.value})}
                            />
                        </div>
                    </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                        loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                >
                                    {loading ? "Signing up..." : "Sign Up"}
                                </button>
                            </div>
                        </form>
                        <div className="text-sm text-center mt-4">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
    