import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
        <Loader2 className="h-6 w-6 animate-spin text-bitcoin" />
        <span className="text-gray-900 font-medium">Updating data...</span>
      </div>
    </div>
  );
}
