'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchParkingSpotInput } from '@parking/schema';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { RadiusSlider } from './radius-slider';

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

  return (
    <Card className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl shadow-2xl animate-in fade-in slide-in-from-top-4">
      <form onSubmit={handleSearchSubmit} className="flex p-2 gap-2">
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
        <div className="p-4 border-t">
          {/* Radius Slider */}
          <RadiusSlider value={searchState.radius} onChange={handleRadiusChange} />

          {/* Később ide jönne a kategória Select */}
        </div>
      )}
    </Card>
  );
}
