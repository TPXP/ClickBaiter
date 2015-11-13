var self = require('sdk/self');
var tabs = require('sdk/tabs');
var pageMod = require("sdk/page-mod");
var panels = require("sdk/panel");
var ss = require("sdk/simple-storage");
var buttons = require('sdk/ui/button/toggle');

var integrated;
var data = self.data;

/**
 * Integrate Styles
 */
pageMod.PageMod({
  include: "*.facebook.com",
  contentStyleFile: data.url('main.css'),
  contentStyleWhen: 'start'
});

/**
 * Integrate Scripts
 */
pageMod.PageMod({
  include: "*.facebook.com",
  contentScriptFile: [data.url('jquery.js'), data.url('regexs.js'), data.url('baitRemoval.js')],
  contentScriptWhen: 'end',
  onAttach: function (scripts) {
    integrated = scripts;
    var action = ss.storage.action ? ss.storage.action : 'flag';
    integrated.port.emit('init', action);
  }
});

/**
 * Menu Button
 */
var button = buttons.ToggleButton({
  id: "click-baiter",
  label: "ClickBaiter",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: handleChange
});

/**
 * Initialises the menu panel
 */
var panel = panels.Panel({
  contentURL: data.url("panel.html"),
  onHide: handleHide,
  width: 310,
  height: 320,
  contentStyleFile: data.url('main.css'),
  contentScriptFile: [data.url('jquery.js'), data.url('savey.js')]
});

/**
 * Handle show of the panel
 */
function handleChange (state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

/**
 * Handle hide of the panel
 */
function handleHide () {
  button.state('window', {checked: false});
}

/**
 * Event listener for when settings are saved
 */
panel.port.on('saved', function (val) {
  ss.storage.action = val;

  if (integrated) {
    integrated.port.emit('options_updated', val);
  }
});
