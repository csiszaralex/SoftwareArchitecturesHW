'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus } from 'lucide-react';
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

// ... (Kategória konstansok ugyanazok, mint előbb)
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
      setOpen(false); // Bezárjuk a dialogot
      form.reset(); // Tiszta lappal indulunk legközelebb
      queryClient.invalidateQueries({ queryKey: ['parking-spots'] }); // Frissítjük a térképet
    } catch (error: any) {
      toast.error('Hiba történt: ' + (error.response?.data?.message || 'Hiba'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg">
          <Plus className="h-4 w-4" /> Új Parkoló
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Új parkolóhely</DialogTitle>
          <DialogDescription>Oszd meg másokkal a felfedezett helyet.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="space-y-2">
              <FormLabel>Helyszín</FormLabel>
              {/* A Dialogban a térkép néha bugos lehet méret miatt, de a LocationPicker általában jó */}
              <div className="h-[200px]">
                <LocationPicker
                  value={{ lat: form.watch('lat'), lng: form.watch('lng') }}
                  onChange={coords => {
                    form.setValue('lat', coords.lat);
                    form.setValue('lng', coords.lng);
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormLabel>Fotó</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={e => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Létrehozás'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
