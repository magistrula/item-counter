import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import SaveIcon from '@material-ui/icons/Save';

import CounterHeaderMenu from 'app/components/Counter/CounterHeaderMenu';
import { INSTRUCTIONS_TEXT } from 'app/constants/strings';
import styles from 'app/components/Counter/CounterHeader.module.scss';

function CounterHeader({
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
                data-testid="CounterHeader-addCategory"
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
            <div className="u-Ellipsized" data-testid="CounterHeader-title">
              {currPresetTitle}
            </div>
          </Box>

          {currPresetTitle && (
            <Box
              display="flex"
              alignItems="center"
              flexShrink={0}
              className="u-HiddenXs"
            >
              <ButtonGroup variant="text" color="inherit">
                <Button
                  onClick={renameCurrPreset}
                  data-testid="CounterHeader-rename"
                >
                  <EditIcon fontSize="small" />
                </Button>
                <Button
                  onClick={saveCurrPreset}
                  disabled={isCurrPresetSaved}
                  data-testid="CounterHeader-save"
                >
                  <SaveIcon fontSize="small" />
                </Button>
                <Button
                  onClick={deleteCurrPreset}
                  data-testid="CounterHeader-delete"
                >
                  <DeleteForeverIcon fontSize="small" />
                </Button>
              </ButtonGroup>
            </Box>
          )}

          <CounterHeaderMenu
            canEditCurrPreset={!!currPresetTitle}
            isCurrPresetSaved={isCurrPresetSaved}
            presets={presets}
            clearAllCategories={clearAllCategories}
            clearAllCounts={clearAllCounts}
            createPreset={createPreset}
            deleteCurrPreset={deleteCurrPreset}
            renameCurrPreset={renameCurrPreset}
            saveCurrPreset={saveCurrPreset}
            showHelp={showHelp}
            usePreset={usePreset}
          />
        </Box>
      </Box>
    </AppBar>
  );
}

CounterHeader.propTypes = {
  isCurrPresetSaved: PropTypes.bool.isRequired,
  presets: PropTypes.array.isRequired,
  currPresetTitle: PropTypes.string,
  addCategory: PropTypes.func.isRequired,
  clearAllCategories: PropTypes.func.isRequired,
  clearAllCounts: PropTypes.func.isRequired,
  createPreset: PropTypes.func.isRequired,
  deleteCurrPreset: PropTypes.func.isRequired,
  renameCurrPreset: PropTypes.func.isRequired,
  saveCurrPreset: PropTypes.func.isRequired,
  usePreset: PropTypes.func.isRequired,
};

export default CounterHeader;
