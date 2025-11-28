'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormInput } from '@/components/form/form-input';
import { FormSelect } from '@/components/form/form-select';
import { LocationPicker } from '@/components/map/location-picker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { CreateParkingSpotInput, CreateParkingSpotSchema } from '@parking/schema';

const CATEGORY_OPTIONS = [
  { label: 'Ingyenes', value: 'FREE' },
  { label: 'Fizetős', value: 'PAID' },
  { label: 'P+R', value: 'P_PLUS_R' },
  { label: 'Parkolóház', value: 'GARAGE' },
  { label: 'Utcai', value: 'STREET' },
];

export function AddParkingDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<CreateParkingSpotInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateParkingSpotSchema) as any,
    defaultValues: {
      name: '',
      address: '',
      category: 'FREE' as const,
      lat: 47.4979,
      lng: 19.0402,
      images: [],
    },
  });

  async function onSubmit(data: CreateParkingSpotInput) {
    setIsSubmitting(true);
    try {
      const imageUrls: string[] = [];
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await api.post<{ url: string }>('/uploads', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrls.push(uploadRes.data.url);
      }

      await api.post('/parking-spots', { ...data, images: imageUrls });

      toast.success('Parkoló sikeresen létrehozva!');
      setOpen(false);
      form.reset();
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['parking-spots'] });
    } catch (error: any) {
      toast.error('Hiba történt: ' + (error.response?.data?.message || 'Hiba'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg bg-amber-100 hover:bg-amber-300 text-gray-900 dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-gray-100">
          <Plus className="h-4 w-4" /> Új Parkoló
        </Button>
      </DialogTrigger>
      {/* JAVÍTÁS: overflow-y-auto és flex elrendezés a görgethetőségért mobilon is */}
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>Új parkolóhely</DialogTitle>
          <DialogDescription>Oszd meg másokkal a felfedezett helyet.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormInput
              control={form.control}
              name="name"
              label="Megnevezés"
              placeholder="Pl. Ingyenes placc"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                control={form.control}
                name="address"
                label="Cím"
                placeholder="Budapest..."
              />
              <FormSelect
                control={form.control}
                name="category"
                label="Kategória"
                placeholder="Válassz"
                options={CATEGORY_OPTIONS}
              />
            </div>

            {/* JAVÍTÁS: Térkép konténer megerősítése */}
            <div className="space-y-2">
              <FormLabel>Helyszín</FormLabel>
              {/* z-0: A térkép rétege legyen alap szinten
                  relative: Hogy a belső abszolút elemek ne szökjenek ki
                  isolate: Létrehoz egy új stacking contextet
                  overflow-hidden: Levág mindent, ami kilógna
              */}
              <div className="h-[250px] w-full rounded-md border shadow-sm relative z-0 isolate overflow-hidden">
                <LocationPicker
                  value={{ lat: form.watch('lat'), lng: form.watch('lng') }}
                  onChange={coords => {
                    form.setValue('lat', coords.lat);
                    form.setValue('lng', coords.lng);
                  }}
                />
              </div>
            </div>

            {/* JAVÍTÁS: Képfeltöltés (Drag & Drop) - z-index növelése és háttér, hogy biztosan takarjon */}
            <div className="space-y-2 pt-2 relative z-10 bg-background">
              <FormLabel>Fotó feltöltése</FormLabel>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors relative">
                <Input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                />
                <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  {selectedFile ? (
                    <span className="text-primary font-bold">{selectedFile.name}</span>
                  ) : (
                    'Kattints vagy húzz ide egy képet'
                  )}
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Létrehozás'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
