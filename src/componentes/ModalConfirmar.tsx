

interface Props {
  open: boolean;
  texto?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ModalConfirmar = ({ open, texto, onCancel, onConfirm }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-80">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {texto || "¿Seguro que quieres continuar?"}
        </h2>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
