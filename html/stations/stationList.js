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
        state:"使用中",
        code:"GF-25",
        remark: "广州市珠海区"
    }, {
        stationName: "广佛线",
        lightBox: "朝安站",
        shops: "站厅01",
        state:"待租",
        code:"GF-10",
        remark: "兆祥路与朝安路交叉口下"
    }];

    myTableCols = [[ //表头
        { field: 'stationName', title: '线路名称'}
        , { field: 'lightBox', title: '站点名称' }
        , { field: 'code', title: '车站编号' }
        , { field: 'shops', title: '站厅 / 站台名称' }
        , { field: 'remark', title: '地址'}
        , {
            title: '操作', width: 150, fixed: 'right', templet: function (d) {
                return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" sid="deleteBtn" >删除</a><a  style="color:#1E9FFF;cursor:pointer;" sid="editBtn">编辑</a>'
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


        // 新建站厅
        $("#buildNew").click(function () {
            layer.open({
                type: 1,
                width: "500px"
                , offset: "auto"
                , area: ['500px', '400px']
                , id: 'layerDemo' //防止重复弹出
                , content: $("#buildWindow").html()
                , btn: ['确定', '取消']
                , btnAlign: 'c' //按钮居中
                , shade: 0 //不显示遮罩
                , yes: function () {
                    layer.closeAll();
                }
            });
        })


    // 绑定列表中查看和编辑等事件
    function bindTableEvent() {
        $("[sid=editBtn]").click(function () {
            layer.open({
                type: 1,
                width: "500px"
                , offset: "auto"
                , area: ['500px', '400px']
                , id: 'layerDemo' //防止重复弹出
                , content: $("#buildWindow").html()
                , btn: ['确定', '取消']
                , btnAlign: 'c' //按钮居中
                , shade: 0 //不显示遮罩
                , yes: function () {
                    layer.closeAll();
                }
            });
        })

        $("[sid=deleteBtn]").click(function(){
           alert("删除");
        })

    }

});