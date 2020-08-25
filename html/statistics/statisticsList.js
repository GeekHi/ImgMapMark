layui.use(['form', 'table'], function () {
    var form = layui.form,
        $ = layui.$,
        layer = layui.layer,
        table = layui.table;

    // 表头实例
    var myTableCols;

    myTableCols = [[ //表头
        { field: 'stationName', title: '站台名称' }
        , { field: 'type1', title: '12封灯箱' }
        , { field: 'type2', title: '6封灯箱' }
        , { field: 'type3', title: '梯牌' }
        , { field: 'type4', title: '立柱灯箱', width: 120 }
        , { field: 'type5', title: '超级灯箱', width: 120 }
        , { field: 'type6', title: '梯楣灯箱', width: 120 }
        , { field: 'type7', title: '龙门架', width: 200 }
        , { field: 'total', title: '总计', width: 120}
    ]]

    queryTableData();

    // 查询表格数据
    function queryTableData(){
        $.ajax({
            url: "/gzdt/backstage/report/getReport",
            type: "post",
            dataType: "json",
            async: false,
            success: function (result) {
                if (result.res == 1) {
                   remderTable(result.obj);
                } else {
                    remderTable([]);
                }
            }
        })
    }

    // 导出文件
    function exportListFile(){
        var elemIF = document.createElement("iframe");
        elemIF.src = "/gzdt/backstage/report/exportExecl";
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    }
    


    // 导出文件
    $("#exportBtn").click(function(){
        exportListFile();
    })



    function remderTable(tdata){
        loadTable = table.render({
            elem: "#mapTable",
            limit:10,
            page:true,
            cols: myTableCols,
            data:tdata
        });
    }


    // 点击搜索
    $("#searchBtn").click(function(){
        queryTableData();
    })


});