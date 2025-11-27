'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchParkingSpotInput } from '@parking/schema';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadiusSlider } from './radius-slider';

const CATEGORY_OPTIONS = [
  { value: 'ALL', label: 'Összes kategória' }, // Szűrő törléséhez
  { value: 'FREE', label: 'Ingyenes' },
  { value: 'PAID', label: 'Fizetős' },
  { value: 'P_PLUS_R', label: 'P+R (Park & Ride)' },
  { value: 'GARAGE', label: 'Garázs' },
  { value: 'STREET', label: 'Utcai parkolás' },
];

export function SearchAndFilterBar({
  searchState,
  onSearchChange,
}: {
  searchState: SearchParkingSpotInput;
  onSearchChange: (update: Partial<SearchParkingSpotInput>) => void;
}) {
  const [term, setTerm] = useState(searchState.searchTerm || '');
  const [isAdvanced, setIsAdvanced] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange({ searchTerm: term });
  };

  const handleRadiusChange = (radius: number) => {
    onSearchChange({ radius });
  };

  const handleCategoryChange = (categoryValue: string) => {
    const category = categoryValue === 'ALL' ? undefined : categoryValue;
    onSearchChange({ category: category as SearchParkingSpotInput['category'] });
  };

  return (
    <Card className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl shadow-2xl animate-in fade-in slide-in-from-top-4 p-3">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        {/* FIX CSS: A Card belsejében flex, Input w-full, Button mérete fix */}
        <Input
          type="text"
          placeholder="Keresés cím vagy parkoló neve alapján..."
          value={term}
          onChange={e => setTerm(e.target.value)}
        />
        <Button type="submit" size="icon" className="shrink-0">
          <Search className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsAdvanced(p => !p)}
          className="shrink-0"
          aria-expanded={isAdvanced}>
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </form>

      {/* FEJLETT SZŰRŐ RÉTEG */}
      {isAdvanced && (
        <div className="p-2 border-t">
          {/* Radius Slider */}
          <RadiusSlider value={searchState.radius} onChange={handleRadiusChange} />

          {/* Kategória Select */}
          <div className="pt-4 space-y-2">
            <Label className="text-sm font-medium leading-none">Kategória szűrés</Label>
            <Select value={searchState.category || 'ALL'} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Válasszon kategóriát" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </Card>
  );
}
