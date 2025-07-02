"use client"

import axios from "axios";
import { useEffect, useState } from "react";

export default function Fib100() {
  const API_BASE_URL = "http://localhost:3000/fib100";

  const [text, setText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}`, {
          responseType: 'text', 
        });
        setText(response.data || ""); 
      } catch (error) {
        console.error("Failed to call API:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Fibonacci 100</h1>
      <p className="text-lg">{text}</p>
    </div>
  );
}
