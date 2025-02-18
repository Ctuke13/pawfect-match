"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  closeModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ closeModal }) => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [ error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = async () => {
    if (!name || !email) {
      setError("Name and Email are required.");
      toast({
        title: "❌ Login Failed",
        description: error,
        className: "bg-[#b91c1c] text-white border-4 border-black-700 shadow-lg shadow-red-500/50", 
      });
      return;
    }
    try {
      await login(name, email, zipcode);
      
      toast({
        title: "✅ Login Successful",
        description: `Welcome, ${name}!`,
        className: "bg-[#FFC936] text-black font-semibold border-4 border-black shadow-lg shadow-yellow-500/50", 
      });

      closeModal();
    } catch (err){
      setError("Login failed. Please try again.")
      toast({
        title: "❌ Login Failed",
        description: error,
        className: "bg-[#b91c1c] text-white border-4 border-red-700 shadow-lg shadow-red-500/50",
      });
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-1">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>

        {/* Input Fields */}
        <input
          className="mt-4 p-2 w-full border rounded"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="mt-2 p-2 w-full border rounded"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="mt-2 p-2 w-full border rounded"
          type="text"
          placeholder="Enter your zip code (optional)"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
        />

        {/* Login Button */}
        <button
          className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-md hover:bg-yellow-600 font-semibold"
          onClick={handleLogin}
        >
          SIGN IN
        </button>

        {/* Close Modal */}
        <button className="mt-4 w-full text-black hover:text-red-500  hover:underline" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default LoginModal