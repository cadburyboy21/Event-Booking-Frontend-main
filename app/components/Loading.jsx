"use client";

import React from "react";

export default function Loading({ size = "md", fullScreen = false }) {
    const sizes = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    };

    const spinner = (
        <div className="relative">
            <div className={`${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className={`${sizes[size]} scale-75 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin`} style={{ animationDirection: "reverse" }} />
            </div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl">
                    {spinner}
                    <p className="text-white mt-4 text-center">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            {spinner}
        </div>
    );
}
