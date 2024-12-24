import { useCallback } from 'react';

export const useHeatmapColor = (maxCount: number) => {
  const bgColor = 'gray.50';

  return useCallback(
    (count: number) => {
      if (count === 0) return bgColor;
      const intensity = Math.min(0.9, 0.1 + (count / maxCount) * 0.8);
      return `rgba(52, 199, 89, ${intensity})`;
    },
    [maxCount, bgColor]
  );
};
