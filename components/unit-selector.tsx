"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Unit, UnitType, getUnitOptions } from "@/lib/constants/units";

interface UnitSelectorProps {
    unitType: UnitType;
    unit: Unit;
    onUnitChange: (unit: Unit) => void;
    className?: string;
}

export function UnitSelector({
    unitType,
    unit,
    onUnitChange,
    className,
}: UnitSelectorProps) {
    const unitOptions = getUnitOptions(unitType);

    return (
        <Select
            value={unit}
            onValueChange={(value) => onUnitChange(value as Unit)}
        >
            <SelectTrigger className={className}>
                <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
                {unitOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                        {option}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

interface UnitTypeSelectorProps {
    value: UnitType;
    onChange: (type: UnitType) => void;
    className?: string;
}

export function UnitTypeSelector({
    value,
    onChange,
    className,
}: UnitTypeSelectorProps) {
    return (
        <Select
            value={value}
            onValueChange={(value) => onChange(value as UnitType)}
        >
            <SelectTrigger className={className}>
                <SelectValue placeholder="Select unit type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={UnitType.VOLUME}>Volume</SelectItem>
                <SelectItem value={UnitType.WEIGHT}>Weight</SelectItem>
            </SelectContent>
        </Select>
    );
}
