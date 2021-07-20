import { useCallback, useState } from 'react';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { without } from 'lodash';

import ColunterColumn from './counter/column';
import s from './counter/styles.module.scss';

const DEFAULT_COL_NAMES = ['Produce', 'Essentials', 'Dry Goods'];

function makeColumn(name) {
  return { name, items: [] };
}

export default function OrderCounter() {
  const [columns, setColumns] = useState(
    DEFAULT_COL_NAMES.map(name => makeColumn(name))
  );
  const [itemCounts, setItemCounts] = useState({});

  const addColumn = useCallback(() => {
    const colName = window.prompt('Enter column name');
    if (!colName) {
      return;
    }

    const trimmedName = colName.trim();
    if (columnExists(trimmedName)) {
      window.alert('Column already exists');
      return;
    }

    setColumns([...columns, makeColumn(trimmedName)]);
  }, [columns]);

  const removeColumn = useCallback(
    colIdx => {
      if (!window.confirm('Delete column?')) {
        return;
      }

      setColumns(without(columns, columns[colIdx]));
    },
    [columns]
  );

  const editColumn = useCallback(
    colIdx => {
      const newName = window.prompt('Enter new column name');
      if (!newName) {
        return;
      }

      const trimmedNewName = newName.trim();
      if (columnExists(trimmedNewName)) {
        window.alert('Column already exists');
        return;
      }

      const updatedCols = [...columns];
      updatedCols[colIdx].name = trimmedNewName;
      setColumns(updatedCols);
    },
    [columns]
  );

  const addItem = useCallback(
    (itemName, colIdx) => {
      if (!itemName) {
        return;
      }

      const trimmedName = itemName.trim();
      if (itemExists(trimmedName)) {
        window.alert('Item already exists');
        return;
      }

      const updatedCols = [...columns];
      updatedCols[colIdx].items.push(trimmedName);
      setColumns(updatedCols);
    },
    [columns]
  );

  const removeItem = useCallback(
    (itemName, colIdx) => {
      if (!window.confirm('Remove item?')) {
        return;
      }

      const updatedCols = [...columns];
      updatedCols[colIdx].items = without(updatedCols[colIdx].items, itemName);
      setColumns(updatedCols);

      const updatedCounts = Object.assign({}, itemCounts);
      delete updatedCounts[itemName];
      setItemCounts(updatedCounts);
    },
    [columns, itemCounts]
  );

  const editItem = useCallback(
    (oldName, colIdx) => {
      const newName = window.prompt('Enter new item name', oldName);
      if (!newName) {
        return;
      }

      const newTrimmedName = newName.trim();
      if (itemExists(newTrimmedName)) {
        window.alert('Item already exists');
        return;
      }

      const updatedCols = [...columns];
      const colItems = updatedCols[colIdx].items;
      colItems[colItems.indexOf(oldName)] = newTrimmedName;
      setColumns(updatedCols);

      const updatedItemCounts = Object.assign({}, itemCounts, {
        [newTrimmedName]: itemCounts[oldName] || 0,
      });
      delete updatedItemCounts[oldName];
      setItemCounts(updatedItemCounts);
    },
    [columns, itemCounts]
  );

  const incrementItem = useCallback(
    (itemName, increment) => {
      const count = (itemCounts[itemName] || 0) + increment;
      setItemCounts(
        Object.assign({}, itemCounts, {
          [itemName]: count >= 0 ? count : 0,
        })
      );
    },
    [itemCounts]
  );

  const columnExists = colName => {
    const lowerColName = colName.toLowerCase();
    return columns.find(({ name }) => {
      return name.toLowerCase() === lowerColName;
    });
  };

  const itemExists = itemName => {
    return itemName.toLowerCase() in itemCounts;
  };

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

      <Box display="flex" justifyContent="center">
        <Box
          className={s['OrderCounter-columnsContainer']}
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          mt={3}
          mx={6}
        >
          {columns.map((column, idx) => (
            <Box key={column.name} mx={2} mb={4}>
              <ColunterColumn
                addItem={addItem}
                colIdx={idx}
                colName={column.name}
                editItem={editItem}
                incrementItem={incrementItem}
                itemCounts={itemCounts}
                itemNames={column.items}
                removeItem={removeItem}
                editColumn={editColumn}
                removeColumn={removeColumn}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
