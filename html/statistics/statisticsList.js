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
        { field:  'lineName', title: '线路名称'}
        ,{ field: 'stationName', title: '站台名称' }
        ,{ field: 'roomName', title: '站厅名称' }
        , { field: 'lightBox', title: '灯箱' }
        , { field: 'shops', title: '充值机' }
        , { field: 'superLight', title: '超级灯箱', width: 120 }
        , { field: 'streetMap', title: '街区图', width: 120 }
        , { field: 'tv', title: '电视机', width: 200 }
        , {
            title: '操作', width: 120, fixed: 'right', templet: function (d) {
                return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" sid="viewBtn" >查看</a>'
            }
        }
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