import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import MenuItem from '@material-ui/core/MenuItem';

import styles from 'app/components/Counter/CounterPresetMenuItem.module.scss';

function CounterPresetMenuItem({ preset, selectPreset }) {
  const selectPresetCb = useCallback(() => {
    selectPreset(preset);
  }, [preset, selectPreset]);

  return (
    <MenuItem
      dense
      key={preset.name}
      className={styles.CounterPresetMenuItem}
      onClick={selectPresetCb}
      data-testid="CounterHeaderMenu-presetItem"
    >
      <div className="u-Ellipsized">{preset.name}</div>
    </MenuItem>
  );
}

CounterPresetMenuItem.propTypes = {
  preset: PropTypes.object.isRequired,
  selectPreset: PropTypes.func.isRequired,
};

export default CounterPresetMenuItem;
