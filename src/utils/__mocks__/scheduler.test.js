jest.useFakeTimers();

const scheduler = require('../scheduler');

describe('check set and clear interval', () => {
  const callback = jest.fn();

  test('should set interval that periodically called', () => {
    scheduler.setScheduler(callback, 1000);

    expect(setInterval).toHaveBeenCalledWith(callback, 1000);

    jest.advanceTimersByTime(1000);

    expect(callback).toBeCalled();
  });

  test('should clear interval that periodically called', () => {
    scheduler.stopScheduler();

    expect(clearInterval).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
