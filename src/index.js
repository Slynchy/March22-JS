import './styles/style.css';

require('./Settings.js');

global.__M22 = null;

(function() {
  let M22 = new (require('./engine/March22.js'))();

  M22.addViewToDocument();
  M22.start();

  global.__M22 = M22;
})();
