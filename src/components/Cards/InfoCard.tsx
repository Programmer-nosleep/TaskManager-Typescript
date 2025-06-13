import React from "react";
import Card from "../Cards";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode; 
  label?: string;
  value: string;
  color: string; 
}

export default function InfoCard({ icon, label, value, color, className, ...props }: CardProps) {
  return (
    <Card
      className={`flex items-center gap-4 p-4 rounded-xl shadow-md ${className}`}
      {...props}
    >
      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        {label && <div className="text-sm text-gray-500">{label}</div>}
        <div className="text-xl font-semibold">{value}</div>
      </div>
    </Card>
  );
}
