'use client';
import * as z from 'zod';
import { set, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard, Category } from '@prisma/client';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modals/alert-modal';

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'name must in minimium 3 characters',
    })
    .max(50, {
      message: 'name should not exceed 50 characters',
    }),
  billboardId: z.string().min(1),
});

type CategoryFormType = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const title = initialData ? 'Edit category' : 'Add new category';
  const description = initialData ? 'Edit Category' : 'Add new Category';
  const toastMessage = initialData ? 'Category updated.' : 'Category created.';
  const action = initialData ? 'Update' : 'Create';

  const form = useForm<CategoryFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: '',
    },
  });

  const onSubmit = async (data: CategoryFormType) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast({
        title: `category ${action}d`,
      });
    } catch (err) {
      console.log('Billboard onSubmit()', err);
      toast({
        title: `unable to ${action} category`,
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
        `api/${params.storeId}/categories/${params.billboardId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast({
        title: 'category deleted',
      });
    } catch (err) {
      console.log('category onDelete()', err);
      toast({
        title: 'unable to delete category',
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
          <div className="grid grid-cols-3 p-3 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="w-[200px]">
                      <Input
                        placeholder="Category name"
                        disabled={loading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          placeholder="Select Billboard"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                delete
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
};
