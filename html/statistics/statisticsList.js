layui.use(['form', 'table'], function () {
    var form = layui.form,
        $ = layui.$,
        layer = layui.layer,
        table = layui.table;

    // 表头实例
    var myTableCols;
    // 模拟数据
    var mockData = [{
        lineName:"广佛线",
        roomName:"站厅01",
        stationName: "朝安站",
        lightBox: 5,
        shops: 3,
        superLight: 2,
        streetMap: 2,
        tv: 3
    }, {
        lineName:"广佛线",
        roomName:"站厅01",
        stationName: "东平站",
        lightBox: 3,
        shops: 2,
        superLight: 2,
        streetMap: 2,
        tv: 3
    }];

    myTableCols = [[ //表头
        { field: 'stationName', title: '站台名称' }
        , { field: 'lightBox', title: '12封灯箱' }
        , { field: 'lightBox', title: '6封灯箱' }
        , { field: 'shops', title: '梯牌' }
        , { field: 'superLight', title: '立柱灯箱', width: 120 }
        , { field: 'superLight', title: '超级灯箱', width: 120 }
        , { field: 'streetMap', title: '梯楣灯箱', width: 120 }
        , { field: 'tv', title: '龙门架', width: 200 }
        , { field: 'tv', title: '总计', width: 120}
    ]]

    loadTable = table.render({
        elem: "#mapTable",
        cols: myTableCols,
        page: true,
        data: mockData,
        done: function () {
            bindTableEvent();
        }
    });


    // 绑定列表中查看和编辑等事件
    function bindTableEvent() {

        $("[sid=viewBtn]").click(function(){
            location.href = "./statisticDetail.html";
        })

    }

});