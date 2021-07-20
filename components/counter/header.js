import { useCallback } from 'react';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';

import MoreMenu from '../more-menu';
import CounterPresetMenuItem from './preset-menu-item';
import { INSTRUCTIONS_TEXT } from '../../constants/strings';

export default function CounterHeader({
  addCategory,
  clearAllCategories,
  clearAllCounts,
  usePreset,
  presets = [],
}) {
  const showHelp = useCallback(() => {
    window.alert(INSTRUCTIONS_TEXT);
  }, []);

  const usePresetCb = useCallback(
    preset => {
      usePreset(preset);
    },
    [usePreset]
  );

  return (
    <AppBar position="sticky">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={0.5}
      >
        <IconButton color="inherit" onClick={showHelp}>
          <InfoOutlinedIcon />
        </IconButton>

        <Box mx={1}>
          <Button
            variant="contained"
            size="small"
            color="default"
            onClick={addCategory}
          >
            <AddCircleIcon fontSize="small" />
            <Box ml={0.5}>Add Category</Box>
          </Button>
        </Box>

        <MoreMenu>
          <MenuItem onClick={clearAllCategories}>Clear Categories</MenuItem>

          <MenuItem onClick={clearAllCounts}>Clear Counts</MenuItem>

          {presets.length && (
            <Box>
              <Box my={1}>
                <Divider />
              </Box>

              <Box mb={1} px={2}>
                <small>
                  <strong>Presets</strong>
                </small>
              </Box>

              {presets.map(preset => (
                <CounterPresetMenuItem
                  key={preset.name}
                  preset={preset}
                  usePreset={usePreset}
                />
              ))}
            </Box>
          )}
        </MoreMenu>
      </Box>
    </AppBar>
  );
}
