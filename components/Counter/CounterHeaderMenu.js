import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';

import CounterPresetMenuItem from 'app/components/Counter/CounterPresetMenuItem';
import MoreMenu from 'app/components/MoreMenu';

function CounterHeaderMenu({
  canEditCurrPreset,
  isCurrPresetSaved,
  presets,
  clearAllCategories,
  clearAllCounts,
  createPreset,
  deleteCurrPreset,
  renameCurrPreset,
  saveCurrPreset,
  showHelp,
  selectPreset,
}) {
  return (
    <MoreMenu testId="CounterHeaderMenu-MoreMenu">
      <MenuItem
        dense
        onClick={clearAllCategories}
        data-testid="CounterHeaderMenu-clearCategories"
      >
        Clear Categories
      </MenuItem>
      <MenuItem
        dense
        onClick={clearAllCounts}
        data-testid="CounterHeaderMenu-clearCounts"
      >
        Clear Counts
      </MenuItem>
      <MenuItem dense onClick={showHelp} className="u-HiddenNotXs">
        Instructions
      </MenuItem>
      <Divider />

      <Box my={1} px={2}>
        <small>
          <strong>Counters</strong>
        </small>
      </Box>

      {presets.map(preset => (
        <CounterPresetMenuItem
          key={preset.name}
          preset={preset}
          selectPreset={selectPreset}
        />
      ))}

      <MenuItem
        dense
        onClick={createPreset}
        data-testid="CounterHeaderMenu-createNew"
      >
        New ...
      </MenuItem>

      {canEditCurrPreset && (
        <Box>
          <Divider />
          <Box my={1} px={2}>
            <small>
              <strong>Current Counter</strong>
            </small>
          </Box>
          <MenuItem
            dense
            onClick={renameCurrPreset}
            data-testid="CounterHeaderMenu-rename"
          >
            Rename
          </MenuItem>
          <MenuItem
            dense
            onClick={saveCurrPreset}
            disabled={isCurrPresetSaved}
            data-testid="CounterHeaderMenu-save"
          >
            Save
          </MenuItem>
          <MenuItem
            dense
            onClick={deleteCurrPreset}
            data-testid="CounterHeaderMenu-delete"
          >
            Delete
          </MenuItem>
        </Box>
      )}
    </MoreMenu>
  );
}

CounterHeaderMenu.propTypes = {
  canEditCurrPreset: PropTypes.bool.isRequired,
  isCurrPresetSaved: PropTypes.bool.isRequired,
  presets: PropTypes.array.isRequired,
  clearAllCategories: PropTypes.func.isRequired,
  clearAllCounts: PropTypes.func.isRequired,
  createPreset: PropTypes.func.isRequired,
  deleteCurrPreset: PropTypes.func.isRequired,
  renameCurrPreset: PropTypes.func.isRequired,
  saveCurrPreset: PropTypes.func.isRequired,
  selectPreset: PropTypes.func.isRequired,
  showHelp: PropTypes.func.isRequired,
};

export default CounterHeaderMenu;
