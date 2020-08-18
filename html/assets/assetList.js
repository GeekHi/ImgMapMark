layui.use(['form', 'table'], function () {
    var form = layui.form,
        $ = layui.$,
        layer = layui.layer,
        table = layui.table;

    var loadTable;

    // 模拟数据
    var mockData = [{
        stationName: "广佛线",
        lightBox: "沥滘站",
        shops: "广东省佛山市南海区",
        superLight: "CFCL01",
        streetMap: "灯箱类",
        tv: "12封灯箱",
        state: "使用中",
        remark: "无",
        userFor: "广告",
        startDate: "2020-08-10",
        endDate: "2022-08-10",
        transdate: "2022-08-05"
    }, {
        stationName: "广佛线",
        lightBox: "朝安站",
        shops: "广东省佛山市南海区",
        superLight: "CFCL25",
        streetMap: "灯箱类",
        tv: "超级灯箱",
        state: "待租",
        remark: "3.035m*1.52m",
        userFor: "广告",
        startDate: "2019-08-08",
        endDate: "2022-08-10",
        transdate: "2022-08-05"
    }];

    //总表表头
    var commonCols = [[
        { field: 'stationName', title: '物理线路', width: 90 }
        , { field: 'stationName', title: '分段线路', width: 90 }
        , { field: 'lightBox', title: '站点', width: 90 }
        , { field: 'shops', title: '行政区域', width: 200 }
        , { field: 'streetMap', title: '资产类型', width: 120 }
        , { field: 'tv', title: '资产名称', width: 120 }
        , { field: 'superLight', title: '资产编号', width: 120 }
        , { field: 'userFor', title: '用途', width: 90 }
        , { field: 'state', title: '使用状态', width: 90 }
        , { field: 'remark', title: '备注' }
        , {
            title: '操作', fixed: 'right', templet: function (d) {
                return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" sid="viewBtn" >查看</a><a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" sid="editBtn">编辑</a><a  style="color:#1E9FFF;cursor:pointer;" sid="editBtn">删除</a>'
            }
        }
    ]]

    // 广告表头
    var adCols = [[
        { field: 'stationName', title: '物理线路', width: 90 }
        , { field: 'stationName', title: '分段线路', width: 90 }
        , { field: 'lightBox', title: '站点', width: 90 }
        , { field: 'shops', title: '行政区域', width: 200 }
        , { field: 'streetMap', title: '资产类型', width: 120 }
        , { field: 'tv', title: '资产名称', width: 120 }
        , { field: 'superLight', title: '资产编号', width: 120 }
        , { field: 'state', title: '使用状态', width: 90 }
        , { field: 'startDate', title: '开通时间', width: 120 }
        , { field: 'remark', title: '备注' }
        , {
            title: '操作', fixed: 'right', width: 150, templet: function (d) {
                return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" sid="viewBtn" >查看</a><a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" sid="editBtn">编辑</a><a  style="color:#1E9FFF;cursor:pointer;" sid="editBtn">删除</a>'
            }
        }
    ]]

    // 商业表头
    var commercialCols = [[
        { field: 'superLight', title: '资产编号', width: 120 }
        , { field: 'stationName', title: '承租方名称' }
        , { field: 'shops', title: '行政区域', width: 200 }
        , { field: 'streetMap', title: '资产类型', width: 120 }
        , { field: 'startDate', title: '开始出租日期', width: 120 }
        , { field: 'endDate', title: '出租结束日期', width: 120 }
        , { field: 'transdate', title: '交铺日期', width: 120 }
        , { field: 'remark', title: '备注' }
        , {
            title: '操作', fixed: 'right', templet: function (d) {
                return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" sid="viewBtn" >查看</a><a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" sid="editBtn">编辑</a><a  style="color:#1E9FFF;cursor:pointer;" sid="editBtn">删除</a>'
            }
        }
    ]]

    // 通信表头
    var communicateCols = [[
        { field: 'tv', title: '资产名称', width: 120 }
        , { field: 'superLight', title: '资产编号', width: 120 }
        , { field: 'shops', title: '行政区域', width: 200 }
        , { field: 'state', title: '使用状态', width: 90 }
        , { field: 'state', title: '计量单位', width: 90 }
        , { field: 'remark', title: '备注' }
        , {
            title: '操作', fixed: 'right', width: 150, templet: function (d) {
                return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" sid="viewBtn" >查看</a><a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" sid="editBtn">编辑</a><a  style="color:#1E9FFF;cursor:pointer;" sid="editBtn">删除</a>'
            }
        }
    ]]


    loadTable = table.render({
        elem: "#tableBox",
        cols: commonCols,
        page: true,
        data: mockData,
        done: function () {
            bindTableEvent();
        }
    });


    // 绑定列表中查看和编辑等事件
    function bindTableEvent() {

        $("[sid=editBtn]").click(function () {
            layer.open({
                type: 2,
                area: ['850px', '560px'],
                offset: 't',
                content: '../common/assetEdit.html'
                , btn: ['确定', '取消']
                , btnAlign: 'c' //按钮居中
                , yes: function () {
                    layer.closeAll();
                }
            });
        })

        $("[sid=viewBtn]").click(function () {
            layer.open({
                type: 2,
                area: ['850px', '560px'],
                offset: 't',
                content: '../common/assetEdit.html'
                , btn: ['确定', '取消']
                , btnAlign: 'c' //按钮居中
                , yes: function () {
                    layer.closeAll();
                }
            });
        })
        
    }


    // 新建资产
    $("#createAsset").click(function () {
        layer.open({
            type: 2,
            area: ['850px', '560px'],
            offset: 't',
            content: '../common/assetEdit.html'
            , btn: ['确定', '取消']
            , btnAlign: 'c' //按钮居中
            , yes: function () {
                layer.closeAll();
            }
        });
    })

    form.on("select(useFor)", function (data) {

        var useType = data.value;
        // 总表
        if (useType == -1) {

            $("#mytable").empty();
            $("#mytable").append('<table id="tableBox"></table>');
            table.render({
                elem: "#tableBox",
                cols: commonCols,
                page: true,
                data: mockData,
                done: function () {
                    bindTableEvent();
                }
            })

        }
        // 广告表 
        else if (useType == 0) {

            $("#mytable").empty();
            $("#mytable").append('<table id="tableBox"></table>');
            table.render({
                elem: "#tableBox",
                cols: adCols,
                page: true,
                data: mockData,
                done: function () {
                    bindTableEvent();
                }
            })

        } 
        // 商业表
        else if (useType == 1) {

            $("#mytable").empty();
            $("#mytable").append('<table id="tableBox"></table>');
            table.render({
                elem: "#tableBox",
                cols: commercialCols,
                page: true,
                data: mockData,
                done: function () {
                    bindTableEvent();
                }
            })

        }
        // 通信表
        else if (useType == 2) {

            $("#mytable").empty();
            $("#mytable").append('<table id="tableBox"></table>');
            table.render({
                elem: "#tableBox",
                cols: communicateCols,
                page: true,
                data: mockData,
                done: function () {
                    bindTableEvent();
                }
            })

        }
    })


});