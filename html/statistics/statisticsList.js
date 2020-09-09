//配置插件目录
layui.config({
    base: '../../mods/'
    , version: '1.0'
});
layui.use(['form', 'layer', 'layarea','table'], function () {
    var form = layui.form,
        $ = layui.$,
        layer = layui.layer,
        layarea = layui.layarea,
        table = layui.table;

    // 表头实例
    var myTableCols;

    var screenHeight = window.screen.height;

    var autoHeight = parseInt(screenHeight * 0.6);

    var tableInstance;


    myTableCols = [[ //表头
        { field: 'stationName', title: '站台名称' }
        , { field: 'type1', title: '12封灯箱' }
        , { field: 'type2', title: '6封灯箱' }
        , { field: 'type3', title: '梯牌' }
        , { field: 'type4', title: '立柱灯箱', width: 120 }
        , { field: 'type5', title: '超级灯箱', width: 120 }
        , { field: 'type6', title: '梯楣灯箱', width: 120 }
        , { field: 'type7', title: '龙门架', width: 200 }
        , { field: 'total', title: '总计', width: 120 }
    ]]

    // 导出文件
    function exportListFile() {
        var elemIF = document.createElement("iframe");
        elemIF.src = "/gfdt/backstage/report/exportExecl";
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    }



    // 导出文件
    $("#exportBtn").click(function () {
        exportListFile();
    })

    remderTable();



    function remderTable() {
        tableInstance = table.render({
            elem: "#mapTable",
            url: "/gfdt/backstage/report/getReport",
            method: 'post',
            cols: myTableCols,
            limit: 100,
            limits: [100, 200, 500, 1000, 1500],
            height: autoHeight,
            where:{
                stationName: $("#stationName").val()
            },
            headers: {
                token: localStorage.gfToken,
                accountId: localStorage.gfaccountId
            },
            request: {
                pageName: 'pageNum', //页码的参数名称
                limitName: 'pageSize'//每页数据量的参数名
            },
            parseData: function (res) { //res 即为原始返回的数据
                return {
                    "count": res.obj ? res.obj.length : 0, //解析数据长度
                    "data": res.obj ? res.obj : [], //解析数据列表
                    "code": res.res == 1 ? 0 : res.code
                };
            },
            page: true
        });
    }


    // 点击搜索
    $("#searchBtn").click(function () {
        tableInstance.reload({  
            where:{
                stationName: $("#stationName").val()
            },
        })
    })

    layarea.render({
        elem: '#reginpicker',
        data:{
            province: '广东省',
            city: '',
            county: ''
        }
    });

});