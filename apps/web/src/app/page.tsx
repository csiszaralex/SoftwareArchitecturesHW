import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">ParkolóKereső</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-muted-foreground">Jelentkezz be a parkolók kezeléséhez</p>
          <a href="http://localhost:3001/auth/google" className="w-full">
            <Button className="w-full">Belépés Google-lel</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
