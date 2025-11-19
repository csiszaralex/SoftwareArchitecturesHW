'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { LocationPicker } from '@/components/map/location-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { CreateParkingSpotInput, CreateParkingSpotSchema } from '@parking/schema';

// AZ ÚJ IMPORTJAINK:
import { FormInput } from '@/components/form/form-input';
import { FormSelect } from '@/components/form/form-select';
import { isAxiosError } from 'axios';

const ParkingCategory = {
  FREE: 'FREE',
  PAID: 'PAID',
  P_PLUS_R: 'P_PLUS_R',
  GARAGE: 'GARAGE',
  STREET: 'STREET',
} as const;
const CATEGORY_OPTIONS = [
  { label: 'Ingyenes', value: ParkingCategory.FREE },
  { label: 'Fizetős', value: ParkingCategory.PAID },
  { label: 'P+R', value: ParkingCategory.P_PLUS_R },
  { label: 'Parkolóház', value: ParkingCategory.GARAGE },
  { label: 'Utcai', value: ParkingCategory.STREET },
];

export default function AddParkingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<CreateParkingSpotInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateParkingSpotSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      address: '',
      lat: 47.4979,
      lng: 19.0402,
      category: ParkingCategory.FREE,
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
      router.push('/map');
    } catch (error) {
      console.error(error);

      let errorMessage = 'Váratlan hiba történt';

      if (isAxiosError(error)) {
        // Itt a TS már tudja, hogy ez egy AxiosError
        // A backend üzenete lehet string vagy tömb (NestJS validáció esetén)
        const backendMessage = error.response?.data?.message;

        if (Array.isArray(backendMessage)) {
          // Ha több hiba van (pl. validáció), összefűzzük őket
          errorMessage = backendMessage.join(', ');
        } else if (typeof backendMessage === 'string') {
          errorMessage = backendMessage;
        } else {
          // Fallback, ha nincs response (pl. hálózati hiba)
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        // Egyéb JS hiba (pl. kódhiba a frontendben)
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full pb-10">
      <Card>
        <CardHeader>
          <CardTitle>Új parkolóhely</CardTitle>
          <CardDescription>Oszd meg másokkal a felfedezett helyet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 1. Input mező (Sokkal rövidebb!) */}
              <FormInput
                control={form.control}
                name="name"
                label="Megnevezés"
                placeholder="Pl. Ingyenes murvás placc"
              />

              {/* 2. Input mező */}
              <FormInput
                control={form.control}
                name="address"
                label="Cím"
                placeholder="Pl. 1117 Budapest..."
              />

              {/* 3. Select mező */}
              <FormSelect
                control={form.control}
                name="category"
                label="Kategória"
                placeholder="Válassz kategóriát"
                options={CATEGORY_OPTIONS}
              />

              {/* 4. Térkép (Ez marad egyedi) */}
              <div className="space-y-2">
                <FormLabel>Helyszín</FormLabel>
                <LocationPicker
                  value={{ lat: form.watch('lat'), lng: form.watch('lng') }}
                  onChange={coords => {
                    form.setValue('lat', coords.lat);
                    form.setValue('lng', coords.lng);
                  }}
                />
              </div>

              {/* 5. Textarea (Inputot használjuk textarea=true-val) */}
              <FormInput
                control={form.control}
                name="description"
                label="Leírás"
                placeholder="Milyen a burkolat? Mikor van hely?"
                textarea
              />

              {/* 6. Képfeltöltés (Marad egyedi, mert nem standard hook form elem) */}
              <div className="space-y-2">
                <FormLabel>Fotó feltöltése</FormLabel>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors relative">
                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mentés...
                  </>
                ) : (
                  'Parkoló Létrehozása'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
