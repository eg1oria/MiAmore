'use client';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function Modal({ open, onClose, onConfirm }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Подтвердите действие</h2>
        <p className="mb-6">Вы уверены?</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md dark:bg-neutral-900 text-white cursor-pointer hover:dark:bg-neutral-700 transition-colors duration-200">
            Отмена
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-md bg-red-600 text-white cursor-pointer hover:bg-red-800 transition-colors duration-200">
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
