'use client';
import * as z from 'zod';
import { set, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard, Store } from '@prisma/client';
import { useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modals/alert-modal';
import ImageUploader from '../ui/imape-uploader';
import { url } from 'inspector';

const formSchema = z.object({
  label: z
    .string()
    .min(3, {
      message: 'store name must in minimium 3 characters',
    })
    .max(50, {
      message: 'store name should not exceed 50 characters',
    }),
  imageUrl: z.string().url(),
});

type BillboardFormType = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData: initialData,
}) => {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const title = initialData ? 'Edit billboard' : 'Add new billboard';
  const description = initialData
    ? 'Edit billboard details'
    : 'Add new billboard details';
  const toastMessage = initialData
    ? 'Billboard updated.'
    : 'Billboard created.';
  const action = initialData ? 'Update' : 'Create';

  const form = useForm<BillboardFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: '',
    },
  });

  const onSubmit = async (data: BillboardFormType) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast({
        title: `billboard ${action}d`,
      });
    } catch (err) {
      console.log('Billboard onSubmit()', err);
      toast({
        title: `unable to ${action} billboard`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast({
        title: 'billboard deleted',
      });
    } catch (err) {
      console.log('Billboard onDelete()', err);
      toast({
        title: 'unable to delete billboard',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between p-2">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-3">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUploader
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => {
                      field.onChange(url);
                    }}
                    onRemove={() => {
                      field.onChange('');
                      toast({
                        description: 'Image Removed',
                      });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 p-3">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Billboard name"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row-reverse gap-x-2 px-4">
            <Button type="submit" disabled={loading} variant="default">
              {action}
            </Button>
            {initialData && (
              <Button
                disabled={loading}
                type="button"
                variant="destructive"
                onClick={() => setIsOpen(true)}
              >
                delete store
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
};
