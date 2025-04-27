
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "small" | "medium" | "large";
}

const Logo = ({ className = "", showText = true, size = "small" }: LogoProps) => {
  const navigate = useNavigate();

  const sizes = {
    small: "h-8",
    medium: "h-12",
    large: "h-16"
  };

  return (
    <motion.div
      className={`flex items-center gap-2 cursor-pointer ${className}`}
      onClick={() => navigate("/")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <img 
        src="/lovable-uploads/a5e75695-07ee-4b4c-a9ff-582e59c81e02.png" 
        alt="PromptApp Logo" 
        className={`${sizes[size]} w-auto`}
      />
      {showText && (
        <span className="text-xl font-bold text-gray-900">PromptApp</span>
      )}
    </motion.div>
  );
};

export default Logo;
