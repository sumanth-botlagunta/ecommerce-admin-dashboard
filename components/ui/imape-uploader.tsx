'use client';
import { ImageIcon, Trash } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';

interface imageUploadProps {
  disabled?: boolean;
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const ImageUploader: React.FC<imageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const onUpload = (result: any) => {
    // console.log(result);
    try {
      if (result.event !== 'success') {
        throw new Error('Failed to Upload');
      }

      const formats = ['jpeg', 'jpg', 'png', 'svg', 'avif', 'webp'];
      if (!formats.includes(result.info.format)) {
        throw new Error('format not supported');
      }
      onChange(result.info.secure_url);
      toast({
        title: 'image uploaded sucessfully',
      });
    } catch (error) {
      toast({
        title: 'failed to upload image',
        description: 'only jpeg, jpg, png, svg formats are supported',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget uploadPreset="jhiz8aaj" onUpload={onUpload}>
        {({ open }) => {
          function handleOnClick(e: React.MouseEvent<HTMLButtonElement>) {
            e.preventDefault();
            open();
          }
          return (
            <Button
              variant={'outline'}
              type="button"
              disabled={disabled}
              onClick={handleOnClick}
            >
              Upload an Image
              <ImageIcon className="w-4 h-4 ml-2" />
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUploader;
