layui.use(['form', 'table'], function () {
    var form = layui.form,
        $ = layui.$,
        layer = layui.layer,
        table = layui.table;

    // 表头实例
    var myTableCols;
    // 模拟数据
    var mockData = [{
        stationName: "广佛线",
        lightBox: "沥滘站",
        shops: "站厅01",
        superLight: "CFCL01",
        streetMap: "六封灯箱",
        tv: "沥滘-6封灯箱-01",
        state:"使用中",
        remark: "无"
    }, {
        stationName: "广佛线",
        lightBox: "朝安站",
        shops: "站厅01",
        superLight:"CFCL25",
        streetMap: "十二封灯箱",
        tv: "朝安-12封灯箱-25",
        state:"待租",
        remark: "3.035m*1.52m"
    }];

    myTableCols = [[ //表头
        { field: 'stationName', title: '线路名称'}
        , { field: 'lightBox', title: '站点名称' }
        , { field: 'shops', title: '站厅 / 站台名称',width:200 }
        , { field: 'superLight', title: '资产编号', width: 120 }
        , { field: 'streetMap', title: '资产类型', width: 120 }
        , { field: 'tv', title: '资产名称', width: 200 }
        , { field: 'state', title: '点位状态'}
        , { field: 'remark', title: '备注', width: 200 }
        , {
            title: '操作', width: 120, fixed: 'right', templet: function (d) {
                return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" sid="viewBtn" >查看</a><a  style="color:#1E9FFF;cursor:pointer;" sid="editBtn">编辑</a>'
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
        $("[sid=editBtn]").click(function () {
           alert("编辑");
        })

        $("[sid=viewBtn]").click(function(){
           alert("查看");
        })
    }

    

});