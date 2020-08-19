layui.use(['form', 'table'], function () {
    var form = layui.form,
        $ = layui.$,
        layer = layui.layer,
        table = layui.table;

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
        { field: 'physicsLine', title: '物理线路', width: 90 }
        , { field: 'segmentLine', title: '分段线路', width: 90 }
        , { field: 'station', title: '站点', width: 90 }
        , { field: 'area', title: '行政区域', width: 200 }
        , { field: 'assetsType', title: '资产类型', width: 120 }
        , { field: 'assetsName', title: '资产名称', width: 120 }
        , { field: 'assetsId', title: '资产编号', width: 120 }
        , { field: 'status', title: '使用状态', width: 90 }
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

    initCommmonTable();


    // 初始化显示总表
    function initCommmonTable(){
        table.render({
            elem: "#tableBox",
            cols: commonCols,
            page: true,
            url: "/gzdt/backstage/assets/findByPage",
            method: 'post',
            request: {
                pageName: 'pageNum', //页码的参数名称
                limitName: 'pageSize'//每页数据量的参数名
            },
            where: {
                category:"0"
            },
            parseData: function (res) { //res 即为原始返回的数据
                return {
                    "count": res.obj.list? res.obj.list.totalRecord:0, //解析数据长度
                    "data": res.obj.list?  res.obj.results:[], //解析数据列表
                    "code": res.res == 1 ? 0 : res.code
                };
            },
            done: function () {  //表格渲染完成
                bindTableEvent();
            }
        });
    }

    // 初始化商业列表
    function initCommercialTable(){
        table.render({
            elem: "#tableBox",
            cols: commercialCols,
            page: true,
            url: "/gzdt/backstage/assets/findByPage",
            method: 'post',
            request: {
                pageName: 'pageNum', //页码的参数名称
                limitName: 'pageSize'//每页数据量的参数名
            },
            where: {
                category:"1"
            },
            parseData: function (res) { //res 即为原始返回的数据
                return {
                    "count": res.obj.list.totalRecord, //解析数据长度
                    "data": res.obj.list.results, //解析数据列表
                    "code": res.res == 1 ? 0 : res.code
                };
            },
            done: function () {
                bindTableEvent();
            }
        })
    }


    // 初始化广告列表
    function initAdTable(){
        table.render({
            elem: "#tableBox",
            cols: adCols,
            page: true,
            url: "/gzdt/backstage/assets/findByPage",
            method: 'post',
            request: {
                pageName: 'pageNum', //页码的参数名称
                limitName: 'pageSize'//每页数据量的参数名
            },
            where: {
                category:"2"  
            },
            parseData: function (res) { //res 即为原始返回的数据
                return {
                    "count": res.obj.list.totalRecord, //解析数据长度
                    "data": res.obj.list.results, //解析数据列表
                    "code": res.res == 1 ? 0 : res.code
                };
            },
            done: function () {
                bindTableEvent();
            }
        })
    }

    // 初始化通信列表 
    function initCommunicateTable(){
        table.render({
            elem: "#tableBox",
            cols: communicateCols,
            page: true,
            url: "/gzdt/backstage/assets/findByPage",
            method: 'post',
            request: {
                pageName: 'pageNum', //页码的参数名称
                limitName: 'pageSize'//每页数据量的参数名
            },
            where: {
                category:"3"
            },
            parseData: function (res) { //res 即为原始返回的数据
                return {
                    "count": res.obj.list.totalRecord, //解析数据长度
                    "data": res.obj.list.results, //解析数据列表
                    "code": res.res == 1 ? 0 : res.code
                };
            },
            done: function () {
                bindTableEvent();
            }
        })
    }



    // 绑定列表中查看和编辑等事件
    function bindTableEvent() {

        $("[sid=editBtn]").click(function () {

            layer.open({
                type: 2,
                area: ['850px', '560px'],
                offset: 't',
                content: '../common/assetEdit.html?editFlag=2'
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
            content: '../common/assetEdit.html?editFlag=1'
            , btn: ['确定', '取消']
            , btnAlign: 'c' //按钮居中
            , yes: function () {
                top.saveAssetInfo();
                // layer.closeAll();
            }
        });

    })

    form.on("select(useFor)", function (data) {

        var useType = data.value;
        $("#mytable").empty();
        $("#mytable").append('<table id="tableBox"></table>');
        // 总表
        if (useType == -1) {
            initCommmonTable();
        }
        // 广告表 
        else if (useType == 0) {
            initAdTable();
        } 
        // 商业表
        else if (useType == 1) {
            initCommercialTable();
        }
        // 通信表
        else if (useType == 2) {
            initCommunicateTable();
        }
    })


});