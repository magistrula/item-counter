import { useCallback } from 'react';

import MenuItem from '@material-ui/core/MenuItem';

import styles from './PresetMenuItem.module.scss';

export default function CounterPresetMenuItem({
  preset,
  deletePreset,
  usePreset,
}) {
  const usePresetCb = useCallback(() => {
    usePreset(preset);
  }, [preset, usePreset]);

  return (
    <MenuItem
      dense
      key={preset.name}
      className={styles['CounterMoreMenu-presetItem']}
      onClick={usePresetCb}
    >
      <div className="u-Ellipsized">{preset.name}</div>
    </MenuItem>
  );
}
