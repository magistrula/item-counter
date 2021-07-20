import { useCallback } from 'react';

import MenuItem from '@material-ui/core/MenuItem';

export default function CounterPresetMenuItem({ preset, usePreset }) {
  const usePresetCb = useCallback(() => {
    usePreset(preset);
  }, [preset, usePreset]);

  return (
    <MenuItem key={preset.name} onClick={() => usePresetCb(preset)}>
      {preset.name}
    </MenuItem>
  )
}
