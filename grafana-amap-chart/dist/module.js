'use strict';

System.register(['./amapchart_ctrl', 'app/plugins/sdk'], function (_export, _context) {
  "use strict";

  var AmapChartCtrl, loadPluginCss;
  return {
    setters: [function (_amapchart_ctrl) {
      AmapChartCtrl = _amapchart_ctrl.AmapChartCtrl;
    }, function (_appPluginsSdk) {
      loadPluginCss = _appPluginsSdk.loadPluginCss;
    }],
    execute: function () {

      loadPluginCss({
        dark: 'plugins/grafana-amap-panel/css/piechart.dark.css',
        light: 'plugins/grafana-amap-panel/css/piechart.light.css'
      });

      _export('PanelCtrl', AmapChartCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
