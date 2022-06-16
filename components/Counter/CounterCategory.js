import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import CounterItem from 'app/components/Counter/CounterItem';

function CounterCategory({
  categoryId,
  categoryName,
  items,
  addItem,
  renameItem,
  incrementItem,
  removeItem,
  renameCategory,
  removeCategory,
  testId="CounterCategory"
}) {
  const onKeyDownAddItemInput = useCallback(
    event => {
      if (event.keyCode === 13) {
        addItem(event.target.value, categoryId);
        event.target.value = '';
      }
    },
    [categoryId, addItem]
  );

  const renameCategoryCb = useCallback(() => {
    renameCategory(categoryName, categoryId);
  }, [categoryName, categoryId, renameCategory]);

  const removeCategoryCb = useCallback(() => {
    removeCategory(categoryId, categoryName);
  }, [categoryName, categoryId, removeCategory]);

  return (
    <Box data-testid={testId}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <strong>{categoryName}</strong>
        </Box>

        <Box display="flex">
          <IconButton onClick={renameCategoryCb}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={removeCategoryCb}>
            <ClearIcon />
          </IconButton>
        </Box>
      </Box>

      <Box mb={1}>
        <TextField
          className="u-FullWidth"
          placeholder="Enter item"
          onKeyDown={onKeyDownAddItemInput}
        />
      </Box>

      {(items || []).map(item => (
        <Box key={item.id} mb={2}>
          <CounterItem
            itemId={item.id}
            itemName={item.name}
            itemCount={item.count}
            renameItem={renameItem}
            incrementItem={incrementItem}
            removeItem={removeItem}
          />
        </Box>
      ))}
    </Box>
  );
}

CounterCategory.propTypes = {
  categoryId: PropTypes.string.isRequired,
  categoryName: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  addItem: PropTypes.func.isRequired,
  renameItem: PropTypes.func.isRequired,
  incrementItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  renameCategory: PropTypes.func.isRequired,
  removeCategory: PropTypes.func.isRequired,
  testId: PropTypes.string,
};

export default memo(CounterCategory);
