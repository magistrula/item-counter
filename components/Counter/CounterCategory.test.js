/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';

import CounterCategory from 'app/components/Counter/CounterCategory';
import CounterCategoryPO from 'app/components/Counter/CounterCategory.po';

const CATEGORY_ID = 'foo-id';
const CATEGORY_NAME = 'Foo Category';

function doRender({
  categoryId = CATEGORY_ID,
  categoryName = CATEGORY_NAME,
  items = [],
  addItem,
  renameItem,
  incrementItem,
  removeItem,
  renameCategory,
  removeCategory,
}) {
  const { container } = render(
    <CounterCategory
      categoryId={categoryId}
      categoryName={categoryName}
      items={items}
      addItem={addItem || jest.fn()}
      renameItem={renameItem || jest.fn()}
      incrementItem={incrementItem || jest.fn()}
      removeItem={removeItem || jest.fn()}
      renameCategory={renameCategory || jest.fn()}
      removeCategory={removeCategory || jest.fn()}
    />
  );

  return new CounterCategoryPO({ scope: container });
}

it('displays category name', () => {
  const page = doRender({ categoryName: 'My Category' });
  expect(page.nameText).toEqual('My Category');
});

it('can rename the category', () => {
  const renameStub = jest.fn();

  const page = doRender({ renameCategory: renameStub });
  page.renameCategory();

  expect(renameStub).toHaveBeenCalledWith(CATEGORY_ID, CATEGORY_NAME);
});

it('can remove the category', () => {
  const removeStub = jest.fn();

  const page = doRender({ removeCategory: removeStub });
  page.removeCategory();

  expect(removeStub).toHaveBeenCalledWith(CATEGORY_ID, CATEGORY_NAME);
});

it('can add an item', () => {
  const addStub = jest.fn();

  const page = doRender({ addItem: addStub });
  page.addItem('Foo Item');

  expect(addStub).toHaveBeenCalledWith('Foo Item', CATEGORY_ID);
});

it('displays item names', () => {
  const page = doRender({
    items: [
      { id: 'item-a-id', catId: CATEGORY_ID, name: 'Item A', count: 2 },
      { id: 'item-b-id', catId: CATEGORY_ID, name: 'Item B', count: 0 },
      { id: 'item-c-id', catId: CATEGORY_ID, name: 'Item C', count: 10 },
    ],
  });

  expect(page.itemNames).toEqual(['Item A', 'Item B', 'Item C']);
});

it('displays item counts', () => {
  const page = doRender({
    items: [
      { id: 'item-a-id', catId: CATEGORY_ID, name: 'Item A', count: 2 },
      { id: 'item-b-id', catId: CATEGORY_ID, name: 'Item B', count: 0 },
      { id: 'item-c-id', catId: CATEGORY_ID, name: 'Item C', count: 10 },
    ],
  });

  expect(page.itemCounts).toEqual(['2', '0', '10']);
});

it('can increment item count', () => {
  const incrementStub = jest.fn();

  const page = doRender({
    items: [
      { id: 'item-a-id', catId: CATEGORY_ID, name: 'Item A', count: 2 },
      { id: 'item-b-id', catId: CATEGORY_ID, name: 'Item B', count: 0 },
    ],
    incrementItem: incrementStub,
  });
  page.incrementItemCount('Item A');

  expect(incrementStub).toHaveBeenCalledWith('item-a-id', 1);
});

it('can decrement item count', () => {
  const incrementStub = jest.fn();

  const page = doRender({
    items: [
      { id: 'item-a-id', catId: CATEGORY_ID, name: 'Item A', count: 2 },
      { id: 'item-b-id', catId: CATEGORY_ID, name: 'Item B', count: 0 },
    ],
    incrementItem: incrementStub,
  });
  page.decrementItemCount('Item A');

  expect(incrementStub).toHaveBeenCalledWith('item-a-id', -1);
});

it('can clear item count', async () => {
  const incrementStub = jest.fn();

  const page = doRender({
    items: [
      { id: 'item-a-id', catId: CATEGORY_ID, name: 'Item A', count: 2 },
      { id: 'item-b-id', catId: CATEGORY_ID, name: 'Item B', count: 0 },
    ],
    incrementItem: incrementStub,
  });
  page.clearItemCount('Item A');

  expect(incrementStub).toHaveBeenCalledWith('item-a-id', -2);
});

it('can rename item', async () => {
  const renameStub = jest.fn();

  const page = doRender({
    items: [
      { id: 'item-a-id', catId: CATEGORY_ID, name: 'Item A', count: 2 },
      { id: 'item-b-id', catId: CATEGORY_ID, name: 'Item B', count: 0 },
    ],
    renameItem: renameStub,
  });
  page.renameItem('Item A');

  expect(renameStub).toHaveBeenCalledWith('item-a-id', 'Item A');
});

it('can remove item', async () => {
  const removeStub = jest.fn();

  const page = doRender({
    items: [
      { id: 'item-a-id', catId: CATEGORY_ID, name: 'Item A', count: 2 },
      { id: 'item-b-id', catId: CATEGORY_ID, name: 'Item B', count: 0 },
    ],
    removeItem: removeStub,
  });
  page.removeItem('Item A');

  expect(removeStub).toHaveBeenCalledWith('item-a-id', 'Item A');
});
