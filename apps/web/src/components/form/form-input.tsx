import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Control, FieldValues, Path } from 'react-hook-form';

// Generikus típusok, hogy bármilyen Zod sémával működjön
interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  type?: string; // pl. "email", "password"
  textarea?: boolean; // Ha true, akkor Textarea-t renderel Input helyett
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  textarea = false,
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {textarea ? (
              <Textarea placeholder={placeholder} className="resize-none" {...field} />
            ) : (
              <Input type={type} placeholder={placeholder} {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
