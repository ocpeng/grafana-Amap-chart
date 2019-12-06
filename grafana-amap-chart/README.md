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
* db.escrowCarInfo.aggregate ( [ 
* { "$match" :   {"point":{"$ne":null, "$exists":true},"overview.soc":{"$ne":null, "$exists":true},"use_nature":{"$ne":1}}  },                  
* {"$project" :   {"城市":"$cityName","车驾号":"$vin","车型":"$modelName","颜色":"$carColor","使用性质":"$use_nature","车牌":"$licenseNo","总里程":"$mileage", "point":"$point", "电量":"$overview.soc", "上报时间":"$pointTime",  "_id" : 0} } ,
* { "$limit":500000},
* { "$skip":2}
* ])
* 注意类型一定要选择table


# 4. demo图片
* 设置, 自行申请amap key
![Image text](https://raw.githubusercontent.com/ocpeng/grafana-amap-chart/master/grafana-amap-chart/demo/01.png)
* 效果展示
![Image text](https://raw.githubusercontent.com/ocpeng/grafana-amap-chart/master/grafana-amap-chart/demo/02.png)
* 如能帮助到您，欢迎给与支持，谢谢
![Image text](https://raw.githubusercontent.com/ocpeng/grafana-amap-chart/master/grafana-amap-chart/demo/03.png)
