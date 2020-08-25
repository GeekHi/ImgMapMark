layui.use(['tree', 'layer', 'form'], function () {
    var layer = layui.layer,
        $ = layui.$,
        form = layui.form,
        tree = layui.tree;

    var locationId;


    // 添加完标记回调
    function addRowToTabel(marks) {

    }

    // 删除标记
    function deleteMark(id) {
        $('#container').ZoomMark('deleteMark', id);
    }

    $(".showMark").mousedown(function () {
        var oId = $(this).data("id");
        if (oId < 10) {
            oId = "0" + oId;
        }
        $('#container').ZoomMark("setAddState", oId);
    })

    // 初始化底图缩放比例
    function initZoom(scale, x, y) {
        $('#container').ZoomMark("zoom", scale, x, y);
    }

    // 获取底图及标记数据
    function getZoomMarkData() {
        return $('#container').ZoomMark("getZoomMarkData");
    }

    // 初始化底图状态
    function initMapState(data) {

        $('#container').ZoomMark({
            'afterMark': addRowToTabel
        });

        if (data.markList.length > 0) {
            // 缩放底图
            $('#container').ZoomMark('changeSettings', {
                imgPosition: {
                    height: Number(data.height),
                    rotate: Number(data.rotate),
                    scale: Number(data.scale),
                    width: Number(data.width),
                    x: Number(data.x),
                    y: Number(data.y)
                }
            });
            // 绘制标点
            $('#container').ZoomMark('setMarkList', data.markList);
            // 校准
            initZoom(1);
        } else {
            $('#container').ZoomMark('reset'); 
            $('#container').ZoomMark('setMarkList', []);
        }

    }


    /* 
      * 解析matrix矩阵，0°-360°，返回旋转角度 
      * 当a=b||-a=b,0<=deg<=180 
      * 当-a+b=180,180<=deg<=270 
      * 当a+b=180,270<=deg<=360 
      * 
      * 当0<=deg<=180,deg=d; 
      * 当180<deg<=270,deg=180+c; 
      * 当270<deg<=360,deg=360-(c||d); 
      * */
    function getmatrix(a, b, c, d, e, f) {
        var aa = Math.round(180 * Math.asin(a) / Math.PI);
        var bb = Math.round(180 * Math.acos(b) / Math.PI);
        var cc = Math.round(180 * Math.asin(c) / Math.PI);
        var dd = Math.round(180 * Math.acos(d) / Math.PI);
        var deg = 0;
        if (aa == bb || -aa == bb) {
            deg = dd;
        } else if (-aa + bb == 180) {
            deg = 180 + cc;
        } else if (aa + bb == 180) {
            deg = 360 - cc || 360 - dd;
        }
        return deg >= 360 ? 0 : deg;
    }


    var step = 15;
    $("#rotate").click(function () {
        var rId = $('#container').ZoomMark("getRotateId");
        if (rId != 'temp') {
            var deg = eval("get" + $("#mark_" + rId).css("transform"));
            var nextDeg = (deg + step) % 360;
            $('#container').ZoomMark("setMarkRotate", rId, nextDeg); 
            $("#mark_" + rId).css({ 'transform': 'rotate(' + nextDeg + 'deg)' });
        }
    })


    // 点击保存标记
    $("#saveMark").click(function () {
        var markData = getZoomMarkData();
        var postData = {
            id: locationId,
            url: $("#locationImg").attr("src"),
            height: markData.imgPosition.height,
            rotate: markData.imgPosition.rotate,
            scale:  markData.imgPosition.scale,
            width:  markData.imgPosition.width,
            x: markData.imgPosition.x,
            y: markData.imgPosition.y
        };
        postData.markList =[];
        $.each(markData.mMarks,function(index,item){
             if(item.available){
                postData.markList.push(item);
             }
        })
        $.ajax({
            url: "/gzdt/backstage/station/update",
            type: "post",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(postData),
            success: function (res) {
                if (res.res == 1) {
                    layer.msg("保存成功！");
                }
            }
        })
    })

    getTreeData();

    // 获取树结构数据
    function getTreeData() {
        $.ajax({
            url: "/gzdt/backstage/station/getTree",
            type: "post",
            dataType: "json",
            async: false,
            success: function (result) {
                if (result.res == 1) {
                    var treeData = JSON.parse(result.obj);
                    if (treeData[0].children[0].children[0].children.length > 0) {
                        locationId = treeData[0].children[0].children[0].children[0].id;
                        queryLocationInfo();
                    }
                    tree.render({
                        elem: '#treeBox'
                        , data: treeData
                        , onlyIconControl: true  //是否仅允许节点左侧图标控制展开收缩
                        , click: function (obj) {
                            $(".layui-tree-set").removeClass("active");
                            $(obj.elem).addClass("active");
                            layer.load(2, {  
                                shade: [0.3, 'gray'], 
                                content: '加载中...',
                                time:1000
                            });
                            locationId = obj.data.id;
                            queryLocationInfo();
                        }
                    });
                }
            }
        })
    }


    // 查询位置信息
    function queryLocationInfo() {
        $.ajax({
            url: "/gzdt/backstage/station/find",
            type: "post",
            dataType: "json",
            async: false,
            data: {
                stationId: locationId
            },
            success: function (result) {
                if (result.res == 1) {
                    $("#locationImg").attr("src", result.obj.url);
                    initMapState(result.obj);
                }
            }
        })
    }

    // 资产展示弹窗
    top.openWindow = function (id) {
        layer.open({
            type: 2,
            area: ['850px', '560px'],
            offset: 't',
            content: '../common/assetsView.html?assetsId=' + id
            , btn: ['确定']
            , btnAlign: 'c' //按钮居中
            , yes: function () {
                layer.closeAll();
            }
        });
    }

    // 展示资产输入input 
    top.showMarkCodeInput = function (id) {
        layer.open({
            type: 1,
            content: $("#markCodeForm").html()
            , btn: ['保存']
            , btnAlign: 'c' //按钮居中
            , closeBtn: 0
            , yes: function () {
                var validated = form.validForm("markCodeForm");
                var assetsCode = $("#markCodeVal").val();
                if (validated) {
                    $.ajax({
                        url: "/gzdt/backstage/assets/isExist",
                        type: "post",
                        dataType: "json",
                        async: false,
                        data: {
                            assetsId:assetsCode
                        },
                        success: function (result) {
                            if(result.obj==true){
                                $("#markcode_" + id).text(assetsCode);
                                $('#container').ZoomMark("setMarkCode", id, assetsCode);
                                layer.closeAll();
                            } else {
                                layer.alert("资产不存在！", {
                                    icon: 5,
                                    title: "提示"
                                });
                            }
                        }
                    })
                }
            }
        });
    }


});