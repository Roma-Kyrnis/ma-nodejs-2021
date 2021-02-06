jest.mock('../../../inputData.json', () => ({ test: '12345qwe' }));

const store = require('../store');

describe('check set and get inputData in/from json file', () => {
  test('should get data from store', () => {
    expect(store.get()).toEqual({ test: '12345qwe' });
  });

  test('should set data to store', () => {
    store.set({ user: 'fasdfo4' });

    expect(store.get()).toEqual({ user: 'fasdfo4' });
  });
});
