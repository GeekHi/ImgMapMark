layui.use(['tree', 'layer', 'form'], function () {
    var layer = layui.layer,
        $ = layui.$,
        form = layui.form,
        tree = layui.tree;

    var locationId;

    var stationId;

    // 动态计算底图画布宽度
    var screenWidth = window.screen.width;
    var autoWidth = screenWidth - 410;

    var maxWith = screenWidth - 280;
    

    $("#container").css("width", autoWidth);

    
    // 展开收起iconList
    $("#iconListHandleBtn").click(function(){
        // 收起
        if($(this).hasClass("menu-packUp")){
            $(this).removeClass("menu-packUp").addClass("menu-spread");
            $("#iconUl").hide();
            $("#iconList").css("width","40px");
            $("#container").css("width", maxWith);
        }
        // 展开
        else if($(this).hasClass("menu-spread")){
            $(this).removeClass("menu-spread").addClass("menu-packUp");
            $("#iconUl").show();
            $("#iconList").css("width","170px");
            $("#container").css("width", autoWidth);
        }
    })

    // 拖拽id
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

        $('#container').ZoomMark({});

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
        // 重置状态锁
        $("#lockBtn").removeClass("switch-open").addClass("switch-lock");
        $('#container').ZoomMark("switchState",false); 

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


    // 旋转
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

    // 拉长
    $("#extention").click(function(){
        var rId = $('#container').ZoomMark("getRotateId");
        if (rId != 'temp') {
            var offWidth = $("#mark_" + rId).width();
            offWidth = Number(offWidth) + 15;
            $("#mark_" + rId).css("width",offWidth);
            $('#container').ZoomMark("setMarkWidth", rId, offWidth);  
        }
    })


    // 点击保存标记
    $("#saveMark").click(function () {
        var markData = getZoomMarkData();
        var postData = {
            id: locationId,
            stationName:stationId,
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
                 var flag = false;
                 $.each(postData.markList,function(i,subItem){
                      if(subItem.x==item.x && subItem.y==item.y){
                          flag = true;
                      }
                 })
                if(!flag){
                    postData.markList.push(item);
                }
             }
        })
        $.ajax({
            url: "/gfdt/backstage/station/update",
            type: "post",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(postData),
            success: function (res) {
                if (res.res == 1) {
                    layer.msg("保存成功！");
                } else {
                    layer.alert("保存失败！", {
                        icon: 5,
                        title: "提示"
                    });
                }
            }
        })
    })

    getTreeData();

    // 获取树结构数据
    function getTreeData() {
        $.ajax({
            url: "/gfdt/backstage/station/getTree",
            type: "post",
            dataType: "json",
            async: false,
            success: function (result) {
                if (result.res == 1) {
                    var treeData = JSON.parse(result.obj);
                    if (treeData[0].children[0].children[0].children.length > 0) {
                        treeData[0].spread = true;
                        treeData[0].children[0].spread = true;
                        treeData[0].children[0].children[0].spread = true;
                        locationId = treeData[0].children[0].children[0].children[0].id;
                        queryLocationInfo();
                    }
                    tree.render({
                        elem: '#myTree'
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
                } else {
                    layer.alert(result.resMsg, {
                        icon: 5,
                        title: "提示"
                    });
                }
            }
        })
    }


    // 查询位置信息
    function queryLocationInfo() {
        $.ajax({
            url: "/gfdt/backstage/station/find",
            type: "post",
            dataType: "json",
            async: false,
            data: {
                stationId: locationId
            },
            success: function (result) {
                if (result.res == 1) {
                    top.setLocationShow(result.obj.lineName+" - " + result.obj.stationName + " - " + result.obj.location)
                    $("#locationImg").attr("src", result.obj.url);
                    stationId = result.obj.stationId;
                    // 等底图替换加载完成再初始化否则无法自动获取宽
                    setTimeout(function() {
                        initMapState(result.obj);
                    }, 1000);
                } else {
                    layer.alert(result.resMsg, {
                        icon: 5,
                        title: "提示"
                    });
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
            , yes: function () {
                var validated = form.validForm("markCodeForm");
                var assetsCode = $.trim($("#markCodeVal").val());
                if (validated) {
                    $.ajax({
                        url: "/gfdt/backstage/assets/find",
                        type: "post",
                        dataType: "json",
                        async: false,
                        headers: {
                            token: localStorage.gfToken,
                            accountId: localStorage.gfaccountId
                        },
                        data: {
                            assetsId:assetsCode
                        },
                        success: function (result) {
                            if(result.obj==null){
                                layer.alert("资产不存在！", {
                                    icon: 5,
                                    title: "提示"
                                });
                            } else {
                                var color;
                                // 在租
                                if(result.obj.letStatus=="可用" && result.obj.leaseName != null){
                                    color = "#f65732";
                                }
                                // 待租
                                else if(result.obj.letStatus=="可用" && result.obj.leaseName == null){
                                    color = "#2ad63e";
                                }
                                // 可用
                                else if(result.obj.status=="可用"){
                                    color = "#000";
                                }
                                // 不可用/ 不可租
                                else if(result.obj.status=="不可用" || result.obj.letStatus=="不可用" ){
                                    color = "#3b32f6";
                                }

                                $("#markcode_" + id).text(assetsCode);
                                $("#markcode_" + id).css("color",color);
                                $('#container').ZoomMark("setMarkCode", id,assetsCode);
                                layer.closeAll();
                            }
                        }
                    })
                }
            },
            cancel: function(index, layero){ 
                $('#container').ZoomMark("deleteMark", id);  
                return true; 
            }
        });
    }

    // 开关
    $("#lockBtn").click(function(){
         if($(this).hasClass("switch-lock")){
            $(this).removeClass("switch-lock").addClass("switch-open");
            $('#container').ZoomMark("switchState",true);    
         } else {
            $(this).removeClass("switch-open").addClass("switch-lock");
            $('#container').ZoomMark("switchState",false); 
         }
    })


});