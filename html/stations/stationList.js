layui.use(['form', 'table'], function () {
    var form = layui.form,
        $ = layui.$,
        layer = layui.layer,
        table = layui.table;

    // 表头实例
    var myTableCols;

    myTableCols = [[ //表头
        { field: 'lineName', title: '线路名称' }
        , { field: 'stationName', title: '站点名称' }
        , { field: 'location', title: '位置' }
        , {
            title: '行政区域', templet: function (d) {
                return '' + d.prov + d.city + d.area;
            }
        }
        , {
            title: '操作', width: 150, fixed: 'right', templet: function (d) {
                return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-id="' + d.id + '" sid="deleteBtn">删除</a><a  style="color:#1E9FFF;cursor:pointer;"  data-id="' + d.id + '" sid="editBtn">编辑</a>'
            }
        }
    ]]

    loadTable = table.render({
        elem: "#mapTable",
        cols: myTableCols,
        page: true,
        url: "/gzdt/backstage/station/findByPage",
        method: 'post',
        request: {
            pageName: 'pageNum', //页码的参数名称
            limitName: 'pageSize'//每页数据量的参数名
        },
        where: {

        },
        parseData: function (res) { //res 即为原始返回的数据
            return {
                "count": res.obj.list.totalRecord, //解析数据长度
                "data": res.obj.list.results, //解析数据列表
                "code": res.res == 1 ? 0 : res.code
            };
        },
        done: function () {  //表格渲染完成
            bindTableEvent();
        }
    });


    // 新建站厅
    $("#buildNew").click(function () {
        layer.open({
            type: 2
            , area: ['850px', '500px']
            , offset: 't'
            , content: '../common/stationEdit.html?editType=1' 
            , btn: ['保存', '关闭']
            , btnAlign: 'c' //按钮居中
            , yes: function () {
                if(top.saveStationInfo()){
                    layer.closeAll();
                } else {
                    layer.alert("请填写位置名称或上传底图！")
                }
            }
        });
        form.render();
    })

       // 保存成功
       top.onSaveSuccess = function () {
        layer.msg("保存成功！");
        $("#searchBtn").click();
    }

    // 保存失败
    top.onSavefail = function (result) {
        layer.alert(result.resMsg, {
            icon: 5,
            title: "提示"
        });
    }


    // 绑定列表中查看和编辑等事件
    function bindTableEvent() {
        $("[sid=editBtn]").click(function () {
            var id = $(this).data("id");
            layer.open({
                type: 2
                , offset: "t"
                , area: ['850px', '500px']
                , offset: 't'
                , content: '../common/stationEdit.html?editType=2&editId='+id
                , btn: ['确定', '取消']
                , btnAlign: 'c' //按钮居中
                , yes: function () {
                    top.saveStationInfo();
                    layer.closeAll();
                    layer.msg("更新成功！");
                    loadTable.reload({});
                }
            });
        })

        $("[sid=deleteBtn]").click(function () {
            var id = $(this).data('id');

            layer.confirm('确定要删除本条数据？', {
                title: "提示",
                btn: ['确定', '取消'] //可以无限个按钮
                , yes: function (index, layero) {
                    layer.closeAll();
                    $.ajax({
                        url: "/gzdt/backstage/station/delete",
                        type: "post",
                        dataType: "json",
                        data: {
                            stationId: Number(id)
                        },
                        success: function (result) {
                            if (result.res == 1) {
                                layer.msg("删除成功！");
                                loadTable.reload({});
                            }
                        }
                    })
                }
            });

        })

        // 点击查找
        $("#searchBtn").click(function () {
            loadTable.reload({
                where:{
                    stationName: $.trim($("#stationName").val())
                }
            })
        })

    }

});