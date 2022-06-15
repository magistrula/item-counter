import { useCallback } from 'react';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import MenuItem from '@material-ui/core/MenuItem';
import SaveIcon from '@material-ui/icons/Save';

import CounterPresetMenuItem from './CounterPresetMenuItem';
import MoreMenu from '../MoreMenu';
import { INSTRUCTIONS_TEXT } from '../../constants/strings';
import styles from './CounterHeader.module.scss';

export default function CounterHeader({
  isCurrPresetSaved,
  presets,
  currPresetTitle,
  addCategory,
  clearAllCategories,
  clearAllCounts,
  createPreset,
  deleteCurrPreset,
  renameCurrPreset,
  saveCurrPreset,
  usePreset,
}) {
  const showHelp = useCallback(() => {
    window.alert(INSTRUCTIONS_TEXT);
  }, []);

  return (
    <AppBar position="sticky">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={0.5}
      >
        <Box display="flex" alignItems="center">
          {currPresetTitle && (
            <Box mr={1}>
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
          )}

          <Box mr={1} className="u-HiddenXs">
            <IconButton color="inherit" onClick={showHelp}>
              <InfoOutlinedIcon />
            </IconButton>
          </Box>
        </Box>

        <Box display="flex" alignItems="center">
          <Box mr={2} className={styles['CounterHeader-title']}>
            <div className="u-Ellipsized">{currPresetTitle}</div>
          </Box>

          {currPresetTitle && (
            <Box
              display="flex"
              alignItems="center"
              flexShrink={0}
              className="u-HiddenXs"
            >
              <ButtonGroup variant="text" color="inherit">
                <Button onClick={renameCurrPreset}>
                  <EditIcon fontSize="small" />
                </Button>
                <Button onClick={saveCurrPreset} disabled={isCurrPresetSaved}>
                  <SaveIcon fontSize="small" />
                </Button>
                <Button onClick={deleteCurrPreset}>
                  <DeleteForeverIcon fontSize="small" />
                </Button>
              </ButtonGroup>
            </Box>
          )}

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

            {currPresetTitle && (
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
        </Box>
      </Box>
    </AppBar>
  );
}