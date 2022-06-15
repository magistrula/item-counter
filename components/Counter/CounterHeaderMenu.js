import React from 'react';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';

import CounterPresetMenuItem from './CounterPresetMenuItem';
import MoreMenu from '../MoreMenu';

export default function CounterHeaderMenu({
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
  usePreset,
}) {
  return (
    <MoreMenu>
      <MenuItem dense onClick={clearAllCategories}>
        Clear Categories
      </MenuItem>
      <MenuItem dense onClick={clearAllCounts}>
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
          usePreset={usePreset}
        />
      ))}

      <MenuItem dense onClick={createPreset}>
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
          <MenuItem dense onClick={renameCurrPreset}>
            Rename
          </MenuItem>
          <MenuItem dense onClick={saveCurrPreset} disabled={isCurrPresetSaved}>
            Save
          </MenuItem>
          <MenuItem dense onClick={deleteCurrPreset}>
            Delete
          </MenuItem>
        </Box>
      )}
    </MoreMenu>
  );
}
