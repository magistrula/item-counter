import { useCallback, useEffect, useState } from 'react';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import ColunterColumn from './counter/column';
import s from './counter/styles.module.scss';

const DEFAULT_COLUMN_NAMES = ['Produce', 'Essentials', 'Dry Goods'];

export default function OrderCounter() {
  const [columnIds, setColumnIds] = useState(DEFAULT_COLUMN_NAMES);
  const [columns, setColumns] = useState({});
  const [itemCounts, setItemCounts] = useState({});

  useEffect(() => {
    setColumns(
      columnIds.reduce((acc, colId) => Object.assign(acc, { [colId]: [] }), {})
    );
  }, [columnIds]);

  const addColumn = useCallback(() => {
    const colId = window.prompt('Enter column id');
    if (!colId) {
      return;
    }

    const lowerColId = colId.toLowerCase();
    const isDuplicate = columnIds.find(id => id.toLowerCase() === lowerColId);
    if (isDuplicate) {
      window.alert('Column already exists');
      return;
    }

    setColumnIds([...columnIds, colId]);
  }, [columnIds]);

  const removeColumn = useCallback(
    colId => {
      if (!window.confirm('Delete column?')) {
        return;
      }

      setColumnIds(columnIds.filter(id => id !== colId));
    },
    [columnIds]
  );

  const addItem = useCallback(
    (itemName, colId) => {
      const lowerItemName = itemName.toLowerCase();
      if (lowerItemName in itemCounts) {
        window.alert('Item already exists');
        return;
      }

      const updatedColumns = Object.assign({}, columns, {
        [colId]: columns[colId].concat([itemName]),
      });
      setColumns(updatedColumns);
      setItemCounts(Object.assign({}, itemCounts, { [itemName]: 0 }));
    },
    [columns, itemCounts]
  );

  const removeItem = useCallback(
    (itemName, colId) => {
      if (!window.confirm('Remove item?')) {
        return;
      }

      const updatedColumns = Object.assign({}, columns, {
        [colId]: columns[colId].filter(item => item !== itemName),
      });
      setColumns(updatedColumns);

      const updatedCounts = Object.assign({}, itemCounts);
      delete updatedCounts[itemName];
      setItemCounts(updatedCounts);
    },
    [columns, itemCounts]
  );

  const incrementItem = useCallback(
    (itemName, increment) => {
      const count = itemCounts[itemName] + increment;
      setItemCounts(
        Object.assign({}, itemCounts, {
          [itemName]: count >= 0 ? count : 0,
        })
      );
    },
    [itemCounts]
  );

  return (
    <>
      <AppBar position="sticky">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={1.5}
        >
          Item Counter
          <Button
            variant="contained"
            size="small"
            color="default"
            onClick={addColumn}
          >
            <AddCircleIcon />
            <Box ml={0.5}>Add Column</Box>
          </Button>
        </Box>
      </AppBar>

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        className="OrderCounter"
        mt={3}
      >
        {Object.keys(columns).map(colId => (
          <Box key={colId} mx={2} mb={4}>
            <ColunterColumn
              addItem={addItem}
              colId={colId}
              incrementItem={incrementItem}
              itemCounts={itemCounts}
              itemNames={columns[colId]}
              removeItem={removeItem}
              removeColumn={removeColumn}
            />
          </Box>
        ))}
      </Box>
    </>
  );
}
