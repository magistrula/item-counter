import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import MenuItem from '@material-ui/core/MenuItem';

import styles from 'app/components/Counter/CounterPresetMenuItem.module.scss';

function CounterPresetMenuItem({ preset, usePreset }) {
  const usePresetCb = useCallback(() => {
    usePreset(preset);
  }, [preset, usePreset]);

  return (
    <MenuItem
      dense
      key={preset.name}
      className={styles.CounterPresetMenuItem}
      onClick={usePresetCb}
      data-testid="CounterHeaderMenu-presetItem"
    >
      <div className="u-Ellipsized">{preset.name}</div>
    </MenuItem>
  );
}

CounterPresetMenuItem.propTypes = {
  preset: PropTypes.object.isRequired,
  usePreset: PropTypes.func.isRequired,
};

export default CounterPresetMenuItem;
