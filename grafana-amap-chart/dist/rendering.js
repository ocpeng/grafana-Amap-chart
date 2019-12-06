'use strict';

System.register(['lodash', 'jquery'], function (_export, _context) {
    "use strict";

    var _, $, _typeof;

    function link(scope, elem, attrs, ctrl) {
        var data,
            panel,
            map,
            infoWindow,
            cluster,
            markers = [];
        panel = ctrl.panel;
        ctrl.panel.mapInitFlag = false;
        elem = elem.find('.amap_chart_panel_container');

        var amap_id = "amap_container_" + new Date().getTime();
        elem.html('<div id="' + amap_id + '"></div>');

        var pluginInfo = "AMap.Geocoder,AMap.MarkerClusterer";
        if (ctrl.panel.trafficLayer) {
            pluginInfo += ",AMap.MarkerClusterer";
        }
        if (ctrl.panel.menu) {
            pluginInfo += ",AMap.MouseTool";
        }
        if (ctrl.panel.scale) {
            pluginInfo += ",AMap.Scale";
        }
        if (ctrl.panel.toolBar) {
            pluginInfo += ",AMap.OverView,AMap.ToolBar";
        }

        $.getScript("http://webapi.amap.com/maps?v=1.3&key=" + ctrl.panel.AmapKey + "&plugin=" + pluginInfo, function () {

            ctrl.panel.timeer = window.setInterval(function () {
                console.log("init map");
                if ((typeof AMap === 'undefined' ? 'undefined' : _typeof(AMap)) == "object") {
                    window.clearInterval(ctrl.panel.timeer);
                    initMap();
                }
            }, 1000);
        });

        ctrl.events.on('render', function () {
            render(false);
            if (panel.legendType === 'Right side') {
                setTimeout(function () {
                    render(true);
                }, 50);
            }
        });

        function noDataPoints() {
            var html = '<div class="datapoints-warning"><span class="small">No data points</span></div>';
            elem.html(html);
        }

        function setMapStyle() {
            var mapStyleTypeOpt = {
                '幻影黑': 'dark',
                '月光银': 'light',
                '远山黛': 'whitesmoke',
                '草色青': 'fresh',
                '雅士灰': 'grey',
                '涂鸦': 'graffiti',
                '马卡龙': 'macaron',
                '靛青蓝': 'blue',
                '极夜蓝': 'darkblue',
                '酱籽': 'wine'
            };
            var styleType = 'dark';
            if (panel && panel.mapStyleType && "" != panel.mapStyleType) {
                styleType = mapStyleTypeOpt[panel.mapStyleType];
            }
            if (map) {
                map.setMapStyle("amap://styles/" + styleType);
            }

            var height = ctrl.panel.height;
            if (!height) {
                height = ctrl.height;
            }

            console.log("height:" + height);

            $("#" + amap_id).css({ "width": "100%", "height": height });
        }

        function addMapChart() {

            if (!ctrl.panel.mapInitFlag) {
                return;
            }
            if (map) {
                setMapStyle();
                map.clearMap();
                markers = [];
                var dataList = ctrl.data[0];
                if (dataList && dataList.type == "table") {
                    var rows = dataList.rows;
                    $("#" + amap_id).parent().next().html("</br>总数据量：<span style=\"font-size:11px;color:#F00;\">" + rows.length + "</span><br>");
                    var columns = dataList.columns;
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        var winData = {};
                        for (var j = 0; j < row.length; j++) {
                            winData[columns[j].text] = row[j];
                        }
                        addMarker(winData);
                    }

                    addCluster(ctrl.panel.valueClusterer);
                }
            }
        }

        function initMap() {
            var x = panel.mapLat;
            var y = panel.mapLng;
            var zoom = panel.mapZoom;
            map = new AMap.Map(amap_id, {
                resizeEnable: true,
                center: [x, y],
                zoom: parseInt(zoom)
            });
            setMapStyle();
            if (ctrl.panel.scale) {
                map.addControl(new AMap.Scale({ visible: true }));
            }
            if (ctrl.panel.toolBar) {
                map.addControl(new AMap.ToolBar({ visible: true }));
            }

            if (ctrl.panel.trafficLayer) {
                //实时路况图层
                var trafficLayer = new AMap.TileLayer.Traffic({
                    zIndex: 10,
                    autoRefresh: true,
                    opacity: 1
                });
                trafficLayer.setMap(map);
                trafficLayer.show();
            }

            if (ctrl.panel.menu) {
                var ContextMenu = function ContextMenu(map) {
                    var me = this;
                    //地图中添加鼠标工具MouseTool插件
                    this.mouseTool = new AMap.MouseTool(map);
                    this.contextMenuPositon = null;
                    var content = [];
                    content.push("<div class='info1 context_menu'>");
                    content.push("  <p onclick='menu.zoomMenu(0)'>缩小</p>");
                    content.push("  <p class='split_line' onclick='menu.zoomMenu(1)'>放大</p>");
                    content.push("  <p class='split_line' onclick='menu.distanceMeasureMenu()'>距离量测</p>");
                    content.push("  <p onclick='menu.addMarkerMenu()'>添加标记</p>");
                    content.push("</div>");
                    //通过content自定义右键菜单内容
                    this.contextMenu = new AMap.ContextMenu({ isCustom: true, content: content.join('') });
                    //地图绑定鼠标右击事件——弹出右键菜单
                    map.on('rightclick', function (e) {
                        me.contextMenu.open(map, e.lnglat);
                        me.contextMenuPositon = e.lnglat; //右键菜单位置
                    });
                };

                //创建右键菜单
                window.menu = new ContextMenu(map);
                //自定义菜单类

                ContextMenu.prototype.zoomMenu = function zoomMenu(tag) {
                    //右键菜单缩放地图
                    if (tag === 0) {
                        map.zoomOut();
                    }
                    if (tag === 1) {
                        map.zoomIn();
                    }
                    this.contextMenu.close();
                };
                ContextMenu.prototype.distanceMeasureMenu = function () {
                    //右键菜单距离量测
                    this.mouseTool.rule();
                    this.contextMenu.close();
                };
                ContextMenu.prototype.addMarkerMenu = function () {
                    //右键菜单添加Marker标记
                    this.mouseTool.close();
                    var marker = new AMap.Marker({
                        map: map,
                        position: this.contextMenuPositon //基点位置
                    });
                    this.contextMenu.close();
                };
            }

            ctrl.panel.mapInitFlag = true;

            var geocoder = new AMap.Geocoder({
                radius: 2000 //范围，默认：500
            });

            window.geocoderFunction = function (lnglats, scope, func) {
                geocoder.getAddress(lnglats, function (status, result) {
                    var address = [];
                    if (status === 'complete' && result.regeocode.formattedAddress) {
                        if (typeof func == 'function') {
                            func(scope, result.regeocode.formattedAddress);
                        }
                    } else {
                        alert(JSON.stringify(result));
                    }
                });
            };

            render(true);
        }

        function addMarker(winData) {

            var marker = new AMap.Marker({
                extData: winData,
                //map: map,
                content: '<div class="hold"><span class="s1"></span><span class="s2"></span><span class="s3"></span><span class="s4"><img src="http://dev.qingxiangchuxing.com/images/admin/img/car_icon.png" /></span></div>',
                position: [winData.point[0], winData.point[1]]
            });
            //鼠标点击marker弹出自定义的信息窗体
            AMap.event.addListener(marker, 'mouseover', function (e) {
                // 初始化一个信息窗口对象
                var cell = e.target.getExtData();
                var info = "";
                for (var i in cell) {
                    if (i == "point") {
                        info += i + ":<span onclick='geocoderFunction([" + cell[i] + "],$(this),function(_this,a){$(_this).html(a);});' style=\"font-size:11px;color:#F00;\">" + cell[i] + "</span><br>";
                    } else {
                        info += i + ":<span style=\"font-size:11px;color:#F00;\">" + cell[i] + "</span><br>";
                    }
                }
                infoWindow = new AMap.InfoWindow({
                    offset: { x: 16, y: -54 },
                    isCustom: true, //使用自定义窗体
                    content: createInfoWindow("车辆详情", info)
                });
                infoWindow.open(map, marker.getPosition());
                //$(info).click();
            });

            AMap.event.addListener(marker, "mouseout", function (e) {
                closeInfoWindow();
            }, marker);
            markers.push(marker);
        }

        var count = markers.length;
        var _renderClusterMarker = function _renderClusterMarker(context) {
            var factor = Math.pow(context.count / count, 1 / 18);
            var div = document.createElement('div');
            var Hue = 180 - factor * 180;
            var bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
            var fontColor = 'hsla(' + Hue + ',100%,20%,1)';
            var borderColor = 'hsla(' + Hue + ',100%,40%,1)';
            var shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
            div.style.backgroundColor = bgColor;
            var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
            div.style.width = div.style.height = size + 'px';
            div.style.border = 'solid 1px ' + borderColor;
            div.style.borderRadius = size / 2 + 'px';
            div.style.boxShadow = '0 0 1px ' + shadowColor;
            div.innerHTML = context.count;
            div.style.lineHeight = size + 'px';
            div.style.color = fontColor;
            div.style.fontSize = '14px';
            div.style.textAlign = 'center';
            context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
            context.marker.setContent(div);
        };

        function addCluster(tag) {
            if (cluster) {
                cluster.setMap(null);
            }
            if (tag == 'typical') {
                //完全自定义
                cluster = new AMap.MarkerClusterer(map, markers, {
                    gridSize: 80,
                    renderClusterMarker: _renderClusterMarker
                });
            } else if (tag == 'normal') {
                //自定义图标
                var sts = [{
                    url: "https://a.amap.com/jsapi_demos/static/images/blue.png",
                    size: new AMap.Size(32, 32),
                    offset: new AMap.Pixel(-16, -16)
                }, {
                    url: "https://a.amap.com/jsapi_demos/static/images/green.png",
                    size: new AMap.Size(32, 32),
                    offset: new AMap.Pixel(-16, -16)
                }, {
                    url: "https://a.amap.com/jsapi_demos/static/images/orange.png",
                    size: new AMap.Size(36, 36),
                    offset: new AMap.Pixel(-18, -18)
                }, {
                    url: "https://a.amap.com/jsapi_demos/static/images/red.png",
                    size: new AMap.Size(48, 48),
                    offset: new AMap.Pixel(-24, -24)
                }, {
                    url: "https://a.amap.com/jsapi_demos/static/images/darkRed.png",
                    size: new AMap.Size(48, 48),
                    offset: new AMap.Pixel(-24, -24)
                }];
                cluster = new AMap.MarkerClusterer(map, markers, {
                    styles: sts,
                    gridSize: 80
                });
            } else {
                //默认样式
                cluster = new AMap.MarkerClusterer(map, markers, { gridSize: 80 });
            }
        }

        function createInfoWindow(title, content) {
            var info = document.createElement("div");
            info.className = "custom-info input-card content-window-card";

            //可以通过下面的方式修改自定义窗体的宽高
            //info.style.width = "400px";
            // 定义顶部标题
            var top = document.createElement("div");
            var titleD = document.createElement("div");
            var closeX = document.createElement("img");
            top.className = "info-top";
            titleD.innerHTML = title;
            closeX.src = "https://webapi.amap.com/images/close2.gif";
            closeX.onclick = closeInfoWindow;

            top.appendChild(titleD);
            top.appendChild(closeX);
            info.appendChild(top);

            // 定义中部内容
            var middle = document.createElement("div");
            middle.className = "info-middle";
            middle.style.backgroundColor = 'white';
            middle.innerHTML = content;
            info.appendChild(middle);

            // 定义底部内容
            var bottom = document.createElement("div");
            bottom.className = "info-bottom";
            bottom.style.position = 'relative';
            bottom.style.top = '0px';
            bottom.style.margin = '0 auto';
            var sharp = document.createElement("img");
            sharp.src = "https://webapi.amap.com/images/sharp.png";
            bottom.appendChild(sharp);
            info.appendChild(bottom);
            return info;
        }

        //关闭信息窗体
        function closeInfoWindow() {
            map.clearInfoWindow();
        }

        function render(incrementRenderCounter) {
            if (!ctrl.data) {
                return;
            }

            data = ctrl.data;
            panel = ctrl.panel;
            console.log(panel);
            if (0 == ctrl.data.length) {
                noDataPoints();
                //addMapChart();
            } else {
                addMapChart();
            }

            if (incrementRenderCounter) {
                ctrl.renderingCompleted();
            }
        }
    }

    _export('default', link);

    return {
        setters: [function (_lodash) {
            _ = _lodash.default;
        }, function (_jquery) {
            $ = _jquery.default;
        }],
        execute: function () {
            _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
                return typeof obj;
            } : function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
        }
    };
});
//# sourceMappingURL=rendering.js.map
