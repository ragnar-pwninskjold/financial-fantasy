import expect, { createSpy } from 'expect';
import createOnDrop from '../createOnDrop';
import { dataKey } from '../createOnDragStart';

describe('createOnDrop', function () {
  it('should return a function', function () {
    expect(createOnDrop()).toExist().toBeA('function');
  });

  it('should return a function that calls change with result from getData', function () {
    var change = createSpy();
    var getData = createSpy().andReturn('bar');
    createOnDrop('foo', change)({
      dataTransfer: { getData: getData }
    });
    expect(getData).toHaveBeenCalled().toHaveBeenCalledWith(dataKey);
    expect(change).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'bar');
  });
});