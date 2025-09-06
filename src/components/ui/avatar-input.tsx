import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AvatarInputProps {
  onAvatarChange?: (file: File | null) => void;
  placeholder?: string;
}

export function AvatarInput({
  onAvatarChange,
  placeholder = 'Choose an avatar...',
}: Readonly<AvatarInputProps>) {
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file?.type.startsWith('image/')) {
      setFileName(file.name);
      onAvatarChange?.(file);
    } else {
      setFileName('');
      onAvatarChange?.(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <Input
        type="text"
        placeholder={placeholder}
        value={fileName}
        readOnly
        className="flex-1"
      />
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button type="button" variant="outline" onClick={handleButtonClick}>
        Browse
      </Button>
    </div>
  );
}
