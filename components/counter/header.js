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

import CounterPresetMenuItem from './preset-menu-item';
import MoreMenu from '../more-menu';
import { INSTRUCTIONS_TEXT } from '../../constants/strings';
import styles from './header.module.scss';

export default function CounterHeader({
  isSaved,
  presets,
  presetTitle,
  addCategory,
  clearAllCategories,
  clearAllCounts,
  createPreset,
  deletePreset,
  renamePreset,
  savePreset,
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
          <IconButton color="inherit" onClick={showHelp}>
            <InfoOutlinedIcon />
          </IconButton>

          {presetTitle && (
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
          )}
        </Box>

        <Box display="flex" alignItems="center">
          <Box mr={2} className={styles['CounterHeader-title']}>
            <div class="u-ellipsis">{presetTitle}</div>
          </Box>

          {presetTitle && (
            <ButtonGroup variant="text" color="inherit">
              <Button onClick={renamePreset}>
                <EditIcon fontSize="small" />
              </Button>
              <Button onClick={savePreset} disabled={isSaved}>
                <SaveIcon fontSize="small" />
              </Button>
              <Button onClick={deletePreset}>
                <DeleteForeverIcon fontSize="small" />
              </Button>
            </ButtonGroup>
          )}

          <MoreMenu>
            <MenuItem dense onClick={clearAllCategories}>Clear Categories</MenuItem>
            <MenuItem dense onClick={clearAllCounts}>Clear Counts</MenuItem>

            <Divider />

            <Box my={1} px={2}>
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

            <MenuItem dense onClick={createPreset}>
              New ...
            </MenuItem>
          </MoreMenu>
        </Box>
      </Box>
    </AppBar>
  );
}
