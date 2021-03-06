layui.use(['form',  'table'], function () {
    var form = layui.form,
        $ = layui.$,
        layer = layui.layer,
    table = layui.table;

    var allInstance; // 总表实例
    var busInstance; // 商业表实例
    var adInstance;  // 广告表实例
    var comuInstance; //通信表实例
    var deletedInstance;// 删除实例    

    var screenHeight = window.screen.height;

    var autoHeight = parseInt(screenHeight * 0.6) - 50;


    var Use_type = "";

    // 资产类型枚举映射
    var assetsTypeEnumMap = {
        "1": "灯箱类",
        "2": "梯牌类",
        "3": "门架类",
        "4": "商铺",
        "5": "自助设备",
        "6": "写字楼",
        "7": "车位",
        "8": "公寓",
        "9": "电视机",
        "10": "看板",
        "999": "通信设备"
    }

    // 用途枚举映射
    var userTypeEnumMap = {
        "1": "商业",
        "2": "广告",
        "3": "通信"
    }

    // 资产名称映射
    var assetsNameEnumMap = {
        "1": "十二封灯箱",
        "2": "街区图（十二封）",
        "3": "资讯、导向",
        "4": "超级灯箱",
        "5": "梯眉灯箱",
        "6": "电视机",
        "7": "梯牌",
        "8": "六封灯箱",
        "9": "立柱灯箱",
        "10": "龙门架",
        "11": "车厢看板",
        "20": "商铺",
        "21": "自助售卖机",
        "22": "自助照相机",
        "23": "自助雨伞",
        "24": "自助售卡机",
        "25": "自助充值机",
        "26": "写字楼",
        "27": "车位",
        "28": "公寓"
    }

    //总表表头
    var commonCols = [[
        {
            title: '物理线路', width: 90, templet: function (d) {
                return d.physicsLine || "--";
            }
        }
        , {
            title: '分段线路', width: 120, templet: function (d) {
                return d.segmentLine || "--";
            }
        }
        , {
            title: '站点', width: 90, templet: function (d) {
                return d.station || "--";
            }
        }
        , { field: 'location', title: '位置' }
        , {
            title: '行政区域', width: 180, templet: function (d) {
                return d.prov + d.city + d.area;
            }
        }
        , {
            title: '资产类型', width: 120, templet: function (d) {
                return assetsTypeEnumMap[d.assetsType] || ''
            }
        }
        , {
            title: '资产名称', width: 120, templet: function (d) {
                return assetsNameEnumMap[d.assetsName] || d.assetsName;
            }
        }
        , { field: 'assetsId', title: '资产编号', width: 120 }
        , {
            title: '资产用途', width: 90, templet: function (d) {
                return d.assetsPurpose || "--";
            }
        }
        , {
            title: '使用状态', width: 90, templet: function (d) {
                return d.status;
            }
        }
        , { field: 'remark', title: '备注' }
        , {
            title: '操作', width: 150, fixed: 'right', templet: function (d) {
                if(d.isMark==1){
                    return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-id="' + d.assetsId + '"  sid="viewBtn" >查看</a><a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-aid="' + d.assetsId + '"  data-eid="' + d.id + '"   sid="editBtn">编辑</a>'
                }
                return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-id="' + d.assetsId + '"  sid="viewBtn" >查看</a><a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-aid="' + d.assetsId + '"  data-eid="' + d.id + '"   sid="editBtn">编辑</a><a  style="color:#1E9FFF;cursor:pointer;" data-id="' + d.assetsId + '" sid="delBtn">删除</a>'
            }
        }
    ]]

    // 广告表头
    var adCols = [[
        { field: 'physicsLine', title: '物理线路', width: 90 }
        , { field: 'segmentLine', title: '分段线路', width: 120 }
        , {
            title: '站点', width: 90, templet: function (d) {
                return d.station || "--";
            }
        }
        , { field: 'location', title: '位置' }
        , {
            title: '行政区域', width: 200, templet: function (d) {
                return d.prov + d.city + d.area;
            }
        }
        , {
            title: '资产类型', width: 120, templet: function (d) {
                return assetsTypeEnumMap[d.assetsType] || ''
            }
        }
        , {
            title: '资产名称', width: 120, templet: function (d) {
                return assetsNameEnumMap[d.assetsName] || "";
            }
        }
        , { field: 'assetsId', title: '资产编号', width: 120 }
        , {
            title: '资产用途', width: 90, templet: function (d) {
                return d.assetsPurpose || "--";
            }
        }
        , { field: 'status', title: '使用状态', width: 90 }

        , { field: 'beginDate', title: '开通时间', width: 120 }
        , { field: 'remark', title: '备注' }
        , {
            title: '操作', fixed: 'right', width: 150, templet: function (d) {
                if(d.isMark==1){
                    return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-id="' + d.assetsId + '" sid="viewBtn" >查看</a><a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-aid="' + d.assetsId + '"  data-eid="' + d.id + '"  sid="editBtn">编辑</a>'
                }
                return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-id="' + d.assetsId + '" sid="viewBtn" >查看</a><a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-aid="' + d.assetsId + '"  data-eid="' + d.id + '"  sid="editBtn">编辑</a><a  style="color:#1E9FFF;cursor:pointer;" data-id="' + d.assetsId + '" sid="delBtn">删除</a>'
            }
        }
    ]]

    // 商业表头
    var commercialCols = [[
        , {
            title: '站点', width: 120, templet: function (d) {
                return d.station || "--";
            }
        }
        , { field: 'assetsId', title: '资产编号', width: 120 }
        , { field: 'leaseName', title: '承租方名称', width: 180 }
        , {
            title: '行政区域', width: 200, templet: function (d) {
                return d.prov + d.city + d.area;
            }
        }
        , { field: 'location', title: '位置' }
        , {
            title: '资产类型', width: 120, templet: function (d) {
                return assetsTypeEnumMap[d.assetsType] || ''
            }
        }
        , {
            title: '使用状态', width: 90, templet: function (d) {
                return d.letStatus;
            }
        }
        , { field: 'beginDate', title: '开始出租日期', width: 120 }
        , { field: 'endDate', title: '出租结束日期', width: 120 }
        , { field: 'deliveryDate', title: '交铺日期', width: 120 }
        , { field: 'remark', title: '备注' }
        , {
            title: '操作', width: 150, fixed: 'right', templet: function (d) {
                if(d.isMark==1){
                    return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-id="' + d.assetsId + '" sid="viewBtn" >查看</a><a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-aid="' + d.assetsId + '"  data-eid="' + d.id + '"  sid="editBtn">编辑</a>'
                }
                return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-id="' + d.assetsId + '" sid="viewBtn" >查看</a><a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-aid="' + d.assetsId + '"  data-eid="' + d.id + '"  sid="editBtn">编辑</a><a  style="color:#1E9FFF;cursor:pointer;" data-id="' + d.assetsId + '" sid="delBtn">删除</a>'
            }
        }
    ]]

    // 通信表头
    var communicateCols = [[
        { field: 'assetsName', title: '资产名称', width: 120 }
        , { field: 'assetsId', title: '资产编号', width: 120 }
        , {
            title: '行政区域', width: 200, templet: function (d) {
                return d.prov + d.city + d.area;
            }
        }
        , { field: 'status', title: '使用状态', width: 90 }
        , { field: 'unit', title: '计量单位', width: 90 }
        , { field: 'location', title: '位置' }
        , { field: 'remark', title: '备注' }
        , {
            title: '操作', fixed: 'right', width: 150, templet: function (d) {
                return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-id="' + d.assetsId + '"  sid="viewBtn" >查看</a><a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-aid="' + d.assetsId + '"  data-eid="' + d.id + '"  sid="editBtn">编辑</a><a  style="color:#1E9FFF;cursor:pointer;" data-id="' + d.assetsId + '" sid="delBtn">删除</a>'
            }
        }
    ]]

    // 已删除表头
    var deletedCols = [[
        { field: 'physicsLine', title: '线路', width: 90 }
        , { field: 'station', title: '站点', width: 90 }
        , { field: 'location', title: '位置' }
        , {
            title: '资产类型', width: 120, templet: function (d) {
                return assetsTypeEnumMap[d.assetsType] || ''
            }
        }
        , {
            title: '资产名称', width: 120, templet: function (d) {
                return assetsNameEnumMap[d.assetsName] || d.assetsName;
            }
        }
        , { field: 'assetsId', title: '资产编号' }
        , {
            title: '用途', width: 90, templet: function (d) {
                return userTypeEnumMap[d.assetsCategory] || "";
            }
        }
        , { field: 'status', title: '使用状态' }
        , { field: 'delDes', title: '说明' }
        , { field: 'remark', title: '备注' }
        , {
            title: '操作', fixed: 'right', width: 150, templet: function (d) {
                return '<a  style="color:#1E9FFF;cursor:pointer;margin-right:10px;" data-id="' + d.assetsId + '"  sid="viewBtn" >查看</a><a  style="color:#1E9FFF;cursor:pointer;" data-id="' + d.assetsId + '"  sid="revertBtn"  >恢复</a>'
            }
        }
    ]];


    initCommmonTable();


    // 初始化显示总表
    function initCommmonTable() {
        allInstance = table.render({
            elem: "#tableBox",
            cols: commonCols,
            page: true,
            url: "/gfdt/backstage/assets/findByPage",
            method: 'post',
            limit: 50,
            limits: [50, 100, 200, 500, 1000, 1500],
            height: autoHeight,
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
                    "count": res.obj.list ? res.obj.list.totalRecord : 0, //解析数据长度
                    "data": res.obj.list ? res.obj.list.results : [], //解析数据列表
                    "code": res.res == 1 ? 0 : res.code
                };
            },
            done: function () {  //表格渲染完成
                bindTableEvent();
            }
        });
    }

    // 初始化商业列表
    function initCommercialTable() {
        busInstance = table.render({
            elem: "#tableBox",
            cols: commercialCols,
            page: true,
            url: "/gfdt/backstage/assets/findByPage",
            method: 'post',
            limit: 50,
            limits: [50, 100, 200, 500, 1000, 1500],
            height: autoHeight,
            headers: {
                token: localStorage.gfToken,
                accountId: localStorage.gfaccountId
            },
            request: {
                pageName: 'pageNum', //页码的参数名称
                limitName: 'pageSize'//每页数据量的参数名
            },
            where: {
                category: "1"
            },
            parseData: function (res) { //res 即为原始返回的数据
                return {
                    "count": res.obj.list ? res.obj.list.totalRecord : 0, //解析数据长度
                    "data": res.obj.list ? res.obj.list.results : [], //解析数据列表
                    "code": res.res == 1 ? 0 : res.code
                };
            },
            done: function () {
                bindTableEvent();
            }
        })
    }


    // 初始化广告列表
    function initAdTable() {
        adInstance = table.render({
            elem: "#tableBox",
            cols: adCols,
            page: true,
            url: "/gfdt/backstage/assets/findByPage",
            method: 'post',
            limit: 50,
            limits: [50, 100, 200, 500, 1000, 1500],
            height: autoHeight,
            headers: {
                token: localStorage.gfToken,
                accountId: localStorage.gfaccountId
            },
            request: {
                pageName: 'pageNum', //页码的参数名称
                limitName: 'pageSize'//每页数据量的参数名
            },
            where: {
                category: "2"
            },
            parseData: function (res) { //res 即为原始返回的数据
                return {
                    "count": res.obj.list ? res.obj.list.totalRecord : 0, //解析数据长度
                    "data": res.obj.list ? res.obj.list.results : [], //解析数据列表
                    "code": res.res == 1 ? 0 : res.code
                };
            },
            done: function () {
                bindTableEvent();
            }
        })
    }

    // 初始化通信列表 
    function initCommunicateTable() {
        comuInstance = table.render({
            elem: "#tableBox",
            cols: communicateCols,
            page: true,
            url: "/gfdt/backstage/assets/findByPage",
            method: 'post',
            limit: 50,
            limits: [50, 100, 200, 500, 1000, 1500],
            height: autoHeight,
            headers: {
                token: localStorage.gfToken,
                accountId: localStorage.gfaccountId
            },
            request: {
                pageName: 'pageNum', //页码的参数名称
                limitName: 'pageSize'//每页数据量的参数名
            },
            where: {
                category: "3"
            },
            parseData: function (res) { //res 即为原始返回的数据
                return {
                    "count": res.obj.list ? res.obj.list.totalRecord : 0, //解析数据长度
                    "data": res.obj.list ? res.obj.list.results : [], //解析数据列表
                    "code": res.res == 1 ? 0 : res.code
                };
            },
            done: function () {
                bindTableEvent();
            }
        })
    }

    // 初始化删除列表
    function initDeletedTableList() {
        deletedInstance = table.render({
            elem: "#tableBox",
            cols: deletedCols,
            page: true,
            url: "/gfdt/backstage/assets/findByPage",
            method: 'post',
            limit: 50,
            limits: [50, 100, 200, 500, 1000, 1500],
            height: autoHeight,
            headers: {
                token: localStorage.gfToken,
                accountId: localStorage.gfaccountId
            },
            request: {
                pageName: 'pageNum', //页码的参数名称
                limitName: 'pageSize'//每页数据量的参数名
            },
            where: {
                category: "-1"
            },
            parseData: function (res) { //res 即为原始返回的数据
                return {
                    "count": res.obj.list ? res.obj.list.totalRecord : 0, //解析数据长度
                    "data": res.obj.list ? res.obj.list.results : [], //解析数据列表
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
            var eid = $(this).data("eid");
            var aid = $(this).data("aid");
            layer.open({
                type: 2,
                area: ['900px', '560px'],
                offset: 't',
                content: '../common/assetEdit.html?editFlag=2&editId=' + eid + '&assetsId=' + aid
                , btn: ['确定', '取消']
                , btnAlign: 'c' //按钮居中
                , yes: function () {
                    layer.closeAll();
                    top.saveAssetInfo();
                }
            });
        })

        // 查看资产
        $("[sid=viewBtn]").click(function () {
            var id = $(this).data("id");
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
        })

        // 删除资产
        $("[sid=delBtn]").click(function () {

            var id = $(this).data("id");
            layer.confirm('确定要删除本条数据？', {
                title: "提示",
                btn: ['确定', '取消'] //可以无限个按钮
                , yes: function (index, layero) {
                    layer.closeAll();
                    showDeleteDesInput(id);
                }
            });

        })

        // 恢复已删除
        $("[sid=revertBtn]").click(function(){
            var aid = $(this).data("id");
            $.ajax({
                url: "/gfdt/backstage/assets/delete_reply",
                type: "post",
                headers: {
                    token: localStorage.gfToken,
                    accountId: localStorage.gfaccountId
                },
                dataType: "json",
                async: false,
                data: {
                    assetsId: aid,
                },
                success: function (result) {
                    if (result.res == 1) {
                        layer.msg("恢复成功！");
                        $("#searchBtn").click();
                    }
                },
                error:function(){
                    layer.alert("恢复失败，请重新登录尝试！", {
                        icon: 5,
                        title: "提示"
                    })
                }
            })
        })


    }

    // 展示删除描述
    function showDeleteDesInput(id) {
        layer.open({
            type: 1,
            // offset: 't',
            area: ['450px', '200px'],
            content: '<div style="padding:0 10px;"><textarea id="deleteDesArea" placeholder="请输入删除说明" class="layui-textarea"></textarea></div>', //这里content是一个普通的String
            btn: ["确定", "取消"],
            btnAlign: 'c', //按钮居中
            yes: function () {
                var delDes = $("#deleteDesArea").val();
                if (delDes != '') {
                    deleteAction({
                        id: id,
                        des: delDes
                    });
                } else {
                    layer.alert("删除描述不能为空！");
                }
            }
        });
    }

    // 删除
    function deleteAction(data) {
        $.ajax({
            url: "/gfdt/backstage/assets/delete",
            type: "post",
            headers: {
                token: localStorage.gfToken,
                accountId: localStorage.gfaccountId
            },
            dataType: "json",
            async: false,
            data: {
                assetsId: data.id,
                delDes: data.des
            },
            success: function (result) {
                if (result.res == 1) {
                    layer.closeAll();
                    layer.msg("删除成功！");
                    $("#searchBtn").click();
                } else {
                    layer.alert(result.resMsg, {
                        icon: 5,
                        title: "提示"
                    });
                }
            }
        })
    }


    // 新建资产
    $("#createAsset").click(function () {

        layer.open({
            type: 2,
            area: ['900px', '560px'],
            offset: 't',
            content: '../common/assetEdit.html?editFlag=1'
            , btn: ['确定', '取消']
            , btnAlign: 'c' //按钮居中
            , yes: function () {
                top.saveAssetInfo();
            }
        });

    })

    // 点击搜索
    $("#searchBtn").click(function () {
        var searchParm = layui.form.val("assetSearchForm");
        if(searchParm.prov==0){
            searchParm.prov='';
        }
        if(searchParm.city==0){
            searchParm.city='';
        }
        if(searchParm.area==0){
            searchParm.area='';
        }
        if (Use_type == "") {
            allInstance.reload({
                where: searchParm
            });
        }
        if (Use_type == 1) {
            busInstance.reload({
                where: searchParm
            });
        }
        if (Use_type == 2) {
            adInstance.reload({
                where: searchParm
            });
        }
        if (Use_type == 3) {
            comuInstance.reload({
                where: searchParm
            });
        }
        if(Use_type==-1){
            deletedInstance.reload({
                where:searchParm
            })
        }
    })

    // 文件导出
    $("#exportBtn").click(function () {
        var formData = layui.form.val("assetSearchForm");
        var elemIF = document.createElement("iframe");
        elemIF.src = "/gfdt/backstage/assets/exportExecl?category=" + formData.category + "&assetsType=" + formData.assetsType + "&searchKey=" + formData.searchKey;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    })


    // 展开
    $("#moreHanle").click(function () {
        if ($(this).hasClass("search-Default")) {
            $(this).removeClass("search-Default").addClass("search-more");
            $("#searchForm").css("height", "110px");
        } else {
            $(this).removeClass("search-more").addClass("search-Default");
            $("#searchForm").css("height", "45px");
        }
    })


    // 保存成功
    top.onSaveSuccess = function () {
        layer.closeAll();
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

    // 监听用途变化
    form.on("select(useFor)", function (data) {

        var useType = data.value;
        Use_type = useType;
        $("#mytable").empty();
        $("#mytable").append('<table id="tableBox"></table>');
        // 总表
        if (useType == "") {
            initCommmonTable();
        }
        // 商业表
        else if (useType == 1) {
            initCommercialTable();
        }
        // 广告表 
        else if (useType == 2) {
            initAdTable();
        }
        // 通信表
        else if (useType == 3) {
            initCommunicateTable();
        }
        // 已删除
        else if (useType == -1) {
            initDeletedTableList();
        }
    })


});