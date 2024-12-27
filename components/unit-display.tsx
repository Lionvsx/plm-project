"use client";

import { Unit, formatQuantity } from "@/lib/constants/units";

interface UnitDisplayProps {
    value: number;
    unit: Unit;
    className?: string;
}

export function UnitDisplay({ value, unit, className }: UnitDisplayProps) {
    return (
        <span className={className}>
            {formatQuantity(value, unit)}
        </span>
    );
}

interface UnitInputProps {
    value: number;
    unit: Unit;
    onChange: (value: number) => void;
    className?: string;
}

export function UnitInput({ value, unit, onChange, className }: UnitInputProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-24"
                step="0.01"
                min="0"
            />
            <span>{unit}</span>
        </div>
    );
}
