import { dataKey } from './createOnDragStart';
var createOnDrop = function createOnDrop(name, change) {
  return function (event) {
    change(name, event.dataTransfer.getData(dataKey));
  };
};
export default createOnDrop;