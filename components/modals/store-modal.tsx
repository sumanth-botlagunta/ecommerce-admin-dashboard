'use client';

import { useStoreModal } from '@/hooks/useStore-modal';
import { Modal } from '@/components/ui/modal';

export const StoreModal = () => {
  const StoreModal = useStoreModal();
  return (
    <Modal
      title="Create Store"
      description="Add new store to manage products and categories"
      isOpen={StoreModal.isOpen}
      onClose={StoreModal.onClose}
    ></Modal>
  );
};
