# 亮点：自研Amap插件，打通MongoDB数据源，展示中国地图
* grafana版本 v6.2.5
* 20191206发布
* 如能帮助到您，欢迎给与支持，谢谢


# 1. 安装
直接将插件复制到grafana目录下，默认目录为/var/lib/grafana/plugins/

# 2. 重启grafana
service grafana restart

# 3. 因为MongoDB存储经纬度比较广泛，选择MongoDB数据源，填写SQL
* 关于MongoDB数据源如何配置，请参考https://github.com/JamesOsgood/mongodb-grafana
* 使用方法腾讯课堂-搜：grafana运维监控与数据分析
* 或者，网易云课堂-搜：grafana运维监控与数据分析


# 4. demo图片
* 设置, 自行申请amap key
![Image text](https://raw.githubusercontent.com/ocpeng/grafana-amap-chart/master/grafana-amap-chart/demo/01.png)
* 效果展示
![Image text](https://raw.githubusercontent.com/ocpeng/grafana-amap-chart/master/grafana-amap-chart/demo/02.png)
* 如能帮助到您，欢迎给与支持，谢谢
![Image text](https://raw.githubusercontent.com/ocpeng/grafana-amap-chart/master/grafana-amap-chart/demo/03.png)
