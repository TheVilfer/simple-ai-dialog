"use client";

import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";


export default function DebugCookies() {
  const [cookieData, setCookieData] = useState<Record<string, string>>({});
  const [tokenValid, setTokenValid] = useState<string>("Checking...");

  useEffect(() => {
    // Get cookies from document
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [name, value] = cookie.split("=");
      if (name && value) {
        acc[name] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    // Add cookies from cookies-next package
    const authToken = getCookie("auth_token");
    const userEmail = getCookie("user_email");

    if (authToken) {
      cookies["auth_token (getCookie)"] = String(authToken);
    }
    if (userEmail) {
      cookies["user_email (getCookie)"] = String(userEmail);
    }

    setCookieData(cookies);

    // Check token validity by making a request to /api/me
    fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${authToken || ""}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setTokenValid(`Valid (${data.email})`);
        } else {
          setTokenValid(`Invalid (${res.status}: ${res.statusText})`);
        }
      })
      .catch((err) => {
        setTokenValid(`Error: ${err.message}`);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Cookie Debug</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Token Status:</h2>
        <div className="p-3 border rounded bg-gray-50">
          {tokenValid}
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-2">Cookies:</h2>
      {Object.keys(cookieData).length === 0 ? (
        <p className="text-red-500">No cookies found</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(cookieData).map(([name, value]) => (
              <tr key={name} className="border-b">
                <td className="border p-2 font-medium">{name}</td>
                <td className="border p-2 break-all">
                  {name.includes("token") ? `${value.substring(0, 10)}...` : value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <div className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Actions:</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => window.location.href = "/"}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Go to Home
          </button>
          <button 
            onClick={() => window.location.href = "/profile"}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Go to Profile
          </button>
          <button 
            onClick={() => {
              document.cookie.split(";").forEach((c) => {
                document.cookie = c
                  .replace(/^ +/, "")
                  .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
              });
              window.location.reload();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear All Cookies
          </button>
        </div>
      </div>
    </div>
  );
} 