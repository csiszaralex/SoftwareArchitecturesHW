'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface RadiusSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function RadiusSlider({ value, onChange }: RadiusSliderProps) {
  return (
    <div className="space-y-2 pt-2">
      <Label className="text-sm font-medium leading-none flex justify-between">
        Keresési sugár
        <span className="font-semibold text-primary">{value / 1000} km</span>
      </Label>
      <Slider
        defaultValue={[value]}
        max={50000} // Max 50 km
        min={500} // Min 500 m
        step={500}
        onValueChange={val => onChange(val[0])}
        className="w-full"
      />
    </div>
  );
}
