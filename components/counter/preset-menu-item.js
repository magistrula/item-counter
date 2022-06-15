import { useCallback } from 'react';

import MenuItem from '@material-ui/core/MenuItem';

export default function CounterPresetMenuItem({
  preset,
  deletePreset,
  usePreset,
}) {
  const usePresetCb = useCallback(() => {
    usePreset(preset);
  }, [preset, usePreset]);

  return (
    <MenuItem dense key={preset.name} onClick={usePresetCb}>
      {preset.name}
    </MenuItem>
  );
}
