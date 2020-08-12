layui.use(['tree','layer'], function () {
    var layer = layui.layer,
    tree = layui.tree;
  //模拟数据1
  var data1 = [{
    title: '广佛线'
    ,id: 1
    ,children: [{
      title: '金融高新区站'
      ,id: 1000
      ,children: [{
        title: '站厅01'
        ,id: 10001
      },{
        title: '站厅02'
        ,id: 10002
      }]
    }]
  },{
    title: '广州地铁1号线'
    ,id: 2
    ,children: [{
      title: '西塱站'
      ,id: 2000
    },{
      title: '广州东站'
      ,id: 2001
    }]
  },{
    title: '广州地铁2号线'
    ,id: 3
    ,children: [{
      title: '广州南站'
      ,id: 3000
    },{
      title: '嘉禾望岗站'
      ,id: 3001
    }]
  }]

  tree.render({
    elem: '#treeBox'
    ,data: data1
    // ,showLine: false  //是否开启连接线
    ,onlyIconControl: true  //是否仅允许节点左侧图标控制展开收缩
    ,click: function(obj){
      layer.msg(JSON.stringify(obj.data));
    }
  });

  
  top.openWindow = function(){
    layer.open({
      type: 2, 
      area: ['800px', '500px'],
      offset: 't',
      content: '../common/light.html'
      , btn: ['确定', '取消']
      , btnAlign: 'c' //按钮居中
      , shade: 0 //不显示遮罩
      , yes: function () {
          layer.closeAll();
      }
    }); 
  }



});