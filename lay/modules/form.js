/**

 @Name：layui.form 表单组件
 @Author：贤心
 @License：MIT
    
 */

layui.define('layer', function(exports) {
    "use strict";

    var $ = layui.$,
        layer = layui.layer,
        hint = layui.hint(),
        device = layui.device()

    , MOD_NAME = 'form', ELEM = '.layui-form', THIS = 'layui-this', SHOW = 'layui-show', HIDE = 'layui-hide', DISABLED = 'layui-disabled'

    , Form = function() {
        this.config = {
            verify: {
                required: function(value){
                    if(!(/[\S]+/.test(value)) || value==null || value == undefined){
                       return '必填项不能为空'
                    }
                },
                phone: [
                    /(^\s*$)|(^1\d{10}$)/, '请输入正确的手机号'
                ],
                phone1: [
                    /(^\s*$)|(^1\d{10}$)|(^(0\d{2,3}-)?\d{7,8}$)/, '请输入11位手机号或区号+电话号码'
                ],
                email: [
                    /(^\s*$)|(^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$)/, '邮箱格式不正确'
                ],
                url: [
                    /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/, '链接格式不正确'
                ],
                number: function(value) {
                    if (value && isNaN(value)) return '只能填写数字'
                },
                date: [
                    /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/, '日期格式不正确'
                ],
                identity: [
                    /(^\s*$)|(^\d{15}$)|(^\d{17}(x|X|\d)$)/, '请输入正确的身份证号'
                ],
                money: [
                    /(^\d*$)|(^[0-9]+(.[0-9]{1,6})?$)/, '不符合金额要求：最多6位小数'
                ],
                floatNum2: [
                    /(^\d*$)|(^[0-9]+(.[0-9]{1,2})?$)/, '最多2位小数'
                ],
                floatNum6: [
                    /(^\d*$)|(^[0-9]+(.[0-9]{1,6})?$)/, '最多6位小数'
                ],
                float: [
                    /(^\s*$)|(^(0|[1-9])[0-9]{0,8}?(\.[0-9]{1,2})?$)/, '最长9位整数加2位小数'
                ],
                int: [
                    /^(0|[1-9][0-9]{0,14})$/, '最长15位整数'
                ],
                minLength: function(value) {
                    if (value.length < 5) {
                        return '至少5个字符';
                    }
                },
                maxLength11: function (value) {
                    if (value.length > 11) {
                        return '至多11个字符';
                    }
                },
                compareDate: function(value) {
                        var flag = contrastTime(value);
                        if (flag == 1) {
                            return '不能小于当前日期';
                        }
                    } // 测试通过属性控制
                    ,
                maxString: function(value, item) {
                    var isValid = true;
                    var maxLength = parseInt($(item).attr('lay-max-length'));
                    if (value.length > maxLength) isValid = false;
                    if (!isValid) return '长度不能超过' + maxLength;

                },
                maxFloat: function(value, item) {
                    var isValid = true;
                    var maxLength = parseInt($(item).attr('lay-max-length'));
                    if (value.indexOf('.') > -1) {
                        if (value.split('.')[1].length > maxLength) isValid = false;
                    }
                    if (!isValid) return '小数点后' + maxLength + '位';
                },
                maxPercent: function(value, item) {
                    var isValid = true;
                    var maxValue = parseFloat($(item).attr('lay-max-value'));
                    if (parseFloat(value) > maxValue) {
                        isValid = false;
                    }
                    if (!isValid) return '最大值为' + maxValue;
                }
            }
        };
    };

    //判断当前选择时间是否小于是当前实际时间
    var contrastTime = function(start) {
        
        var dB = new Date(start.replace(/-/g, "/")); //获取当前选择日期
        var d = new Date();
        var str = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate(); //获取当前实际日期
        if (Date.parse(str) >= Date.parse(dB)) { //时间戳对比
            return 1;
        }
        return 0;
    }

    //全局设置
    Form.prototype.set = function(options) {
        var that = this;
        $.extend(true, that.config, options);
        return that;
    };

    //验证规则设定
    Form.prototype.verify = function(settings) {
        var that = this;
        $.extend(true, that.config.verify, settings);
        return that;
    };

    //表单事件监听
    Form.prototype.on = function(events, callback) {
        return layui.onevent.call(this, MOD_NAME, events, callback);
    };

    var isJsonString = function(str) {
        if (typeof str == 'string') {
            try {
                var obj = JSON.parse(str);
                if (typeof obj == 'object' && obj) {
                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                return false;
            }
        }
    }

    var setFormVal = function(itemForm, object, keyname) {
        //赋值
        layui.each(object, function(key, value) {
            if (typeof value == 'object' || isJsonString(value)) {
                setFormVal(itemForm, value, (keyname ? (keyname + '.') : '') + key);
                return;
            }
            var itemElem = itemForm.find('[name="' + (keyname ? (keyname + '.') : '') + key + '"]'),
                type;

            //如果对应的表单不存在，则不执行
            if (!itemElem[0]) return;
            type = itemElem[0].type;

            //如果为复选框
            if (type === 'checkbox') {
                // 对应是否的，只有一个checkbox的
                if (itemElem.length > 1) {
                    // 对应有多个表单的
                    var cvals = value.split(',');
                    $.each(itemElem, function(_, checkItem) {
                        var thisVal = $(checkItem).attr('value');
                        if ($.inArray(thisVal, cvals) >= 0) $(checkItem).prop('checked', true);
                        else {
                            $(checkItem).prop('checked', false);
                        }
                    })
                } else {
                    // TODO switch
                    if ($(itemElem[0]).attr('lay-skin') == 'switch') {
                        var layValue = $(itemElem[0]).attr('lay-value');
                        $(itemElem[0]).prop('checked', layValue.split('|')[0]==value);
                    }else
                        // 对应一个表单的
                        itemElem[0].checked = value;
                }
            } else if (type === 'radio') { //如果为单选框
                itemElem.each(function() {
                    if (this.value == value) {
                        this.checked = true
                    }
                });
            } else { //其它类型的表单
                itemElem.val(value);
            }
        });

    }

    //赋值/取值
    Form.prototype.val = function(filter, object) {
        var that = this,
            formElem = $(ELEM + '[lay-filter="' + filter + '"]');

        //遍历
        formElem.each(function(index, item) {
            var itemForm = $(this);
            setFormVal(itemForm, object);
        });

        form.render(null, filter);

        //返回值
        return that.getValue(filter);
    };

    //取值
    Form.prototype.getValue = function(filter, itemForm) {
        itemForm = itemForm || $(ELEM + '[lay-filter="' + filter + '"]').eq(0);

        var nameIndex = {}, //数组 name 索引
            field = {},
            fieldElem = itemForm.find('input,select,textarea') //获取所有表单域

        layui.each(fieldElem, function(_, item) {
            item.name = (item.name || '').replace(/^\s*|\s*&/, '');

            if (!item.name) return;

            //用于支持数组 name
            if (/^.*\[\]$/.test(item.name)) {
                var key = item.name.match(/^(.*)\[\]$/g)[0];
                nameIndex[key] = nameIndex[key] | 0;
                item.name = item.name.replace(/^(.*)\[\]$/, '$1[' + (nameIndex[key]++) + ']');
            }
            // 开关类型
            if (/^checkbox|radio$/.test(item.type) && $(item).attr('lay-skin') != 'switch' && !item.checked) return;
            
            // 含有对象name的
            if (item.name.indexOf('.') > 0) {
                var nameobj = item.name.split('.');
                var preName = nameobj[0];
                var aftName = nameobj[1];
                if (typeof field[preName] == 'undefined') field[preName] = {};
                if (/^checkbox|radio$/.test(item.type) && item.checked) {
                    if ($(item).attr('lay-skin') == 'switch') {
                        var layValue = $(item).attr('lay-value');
                        $(item).prop('value', (layValue ? layValue.split('|')[0] : item.value))
                    }
                    // 处理checkbox
                    if (typeof field[preName][aftName] != 'undefined') {
                        field[preName][aftName] += ',' + item.value;
                    } else {
                        field[preName][aftName] = item.value;
                    }
                } else {
                    // 正常表单
                    field[preName][aftName] = $.trim(item.value);
                }
            } else {
                if (/^checkbox|radio$/.test(item.type) && item.checked) {
                    if ($(item).attr('lay-skin') == 'switch') {
                        var layValue = $(item).attr('lay-value');
                        $(item).prop('value', (layValue ? layValue.split('|')[0] : item.value))
                    }
                    // 处理checkbox
                    if (typeof field[item.name] != 'undefined') {
                        field[item.name] += ',' + item.value;
                    } else {
                        field[item.name] = item.value;
                    }
                } else {
                    if ($(item).attr('lay-skin') == 'switch') {
                        var layValue = $(item).attr('lay-value');
                        $(item).prop('value', (layValue ? layValue.split('|')[1] : item.value))
                    }
                    // 正常表单
                    field[item.name] = $.trim(item.value);
                }
            }
        });

        return field;
    };

    //表单控件渲染
    Form.prototype.render = function(type, filter) {
        var that = this,
            elemForm = $(ELEM + function() {
                return filter ? ('[lay-filter="' + filter + '"]') : '';
            }()),
            items = {

                //下拉选择框
                select: function() {
                    var TIPS = '请选择',
                        CLASS = 'layui-form-select',
                        TITLE = 'layui-select-title',
                        NONE = 'layui-select-none',
                        initValue = '',
                        thatInput, selects = elemForm.find('select')

                    //隐藏 select
                    , hide = function(e, clear) {
                        if (!$(e.target).parent().hasClass(TITLE) || clear) {
                            $('.' + CLASS).removeClass(CLASS + 'ed ' + CLASS + 'up');
                            thatInput && initValue && thatInput.val(initValue);
                        }
                        thatInput = null;
                    }

                    //各种事件
                    , events = function(reElem, disabled, isSearch) {
                        var select = $(this),
                            title = reElem.find('.' + TITLE),
                            input = title.find('input'),
                            dl = reElem.find('dl'),
                            dds = dl.children('dd'),
                            index = this.selectedIndex //当前选中的索引
                            ,
                            nearElem; //select 组件当前选中的附近元素，用于辅助快捷键功能

                        if (disabled) return;

                        //展开下拉
                        var showDown = function() {
                            var top = reElem.offset().top + reElem.outerHeight() + 5 - $win.scrollTop(),
                                dlHeight = dl.outerHeight();

                            index = select[0].selectedIndex; //获取最新的 selectedIndex
                            reElem.addClass(CLASS + 'ed');
                            dds.removeClass(HIDE);
                            nearElem = null;

                            //初始选中样式
                            dds.eq(index).addClass(THIS).siblings().removeClass(THIS);

                            //上下定位识别
                            if (top + dlHeight > $win.height() && top >= dlHeight) {
                                reElem.addClass(CLASS + 'up');
                            }

                            followScroll();
                        }

                        //隐藏下拉
                        , hideDown = function(choose) {
                            reElem.removeClass(CLASS + 'ed ' + CLASS + 'up');
                            input.blur();
                            nearElem = null;

                            if (choose) return;

                            notOption(input.val(), function(none) {
                                var selectedIndex = select[0].selectedIndex;

                                //未查询到相关值
                                if (none) {
                                    initValue = $(select[0].options[selectedIndex]).html(); //重新获得初始选中值

                                    //如果是第一项，且文本值等于 placeholder，则清空初始值
                                    if (selectedIndex === 0 && initValue === input.attr('placeholder')) {
                                        initValue = '';
                                    };

                                    //如果有选中值，则将输入框纠正为该值。否则清空输入框
                                    input.val(initValue || '');
                                }
                            });
                        }

                        //定位下拉滚动条
                        , followScroll = function() {
                            var thisDd = dl.children('dd.' + THIS);

                            if (!thisDd[0]) return;

                            var posTop = thisDd.position().top,
                                dlHeight = dl.height(),
                                ddHeight = thisDd.height();

                            //若选中元素在滚动条不可见底部
                            if (posTop > dlHeight) {
                                dl.scrollTop(posTop + dl.scrollTop() - dlHeight + ddHeight - 5);
                            }

                            //若选择玄素在滚动条不可见顶部
                            if (posTop < 0) {
                                dl.scrollTop(posTop + dl.scrollTop() - 5);
                            }
                        };

                        //点击标题区域
                        title.on('click', function(e) {
                            reElem.hasClass(CLASS + 'ed') ? (
                                hideDown()
                            ) : (
                                hide(e, true),
                                showDown()
                            );
                            dl.find('.' + NONE).remove();
                        });

                        //点击箭头获取焦点
                        title.find('.layui-edge').on('click', function() {
                            input.focus();
                        });

                        //select 中 input 键盘事件
                        input.on('keyup', function(e) { //键盘松开
                            var keyCode = e.keyCode;

                            //Tab键展开
                            if (keyCode === 9) {
                                showDown();
                            }
                        }).on('keydown', function(e) { //键盘按下
                            var keyCode = e.keyCode;

                            //Tab键隐藏
                            if (keyCode === 9) {
                                hideDown();
                            }

                            //标注 dd 的选中状态
                            var setThisDd = function(prevNext, thisElem1) {
                                var nearDd, cacheNearElem
                                e.preventDefault();

                                //得到当前队列元素  
                                var thisElem = function() {
                                    var thisDd = dl.children('dd.' + THIS);

                                    //如果是搜索状态，且按 Down 键，且当前可视 dd 元素在选中元素之前，
                                    //则将当前可视 dd 元素的上一个元素作为虚拟的当前选中元素，以保证递归不中断
                                    if (dl.children('dd.' + HIDE)[0] && prevNext === 'next') {
                                        var showDd = dl.children('dd:not(.' + HIDE + ',.' + DISABLED + ')'),
                                            firstIndex = showDd.eq(0).index();
                                        if (firstIndex >= 0 && firstIndex < thisDd.index() && !showDd.hasClass(THIS)) {
                                            return showDd.eq(0).prev()[0] ? showDd.eq(0).prev() : dl.children(':last');
                                        }
                                    }

                                    if (thisElem1 && thisElem1[0]) {
                                        return thisElem1;
                                    }
                                    if (nearElem && nearElem[0]) {
                                        return nearElem;
                                    }

                                    return thisDd;
                                    //return dds.eq(index);
                                }();

                                cacheNearElem = thisElem[prevNext](); //当前元素的附近元素
                                nearDd = thisElem[prevNext]('dd:not(.' + HIDE + ')'); //当前可视元素的 dd 元素

                                //如果附近的元素不存在，则停止执行，并清空 nearElem
                                if (!cacheNearElem[0]) return nearElem = null;

                                //记录附近的元素，让其成为下一个当前元素
                                nearElem = thisElem[prevNext]();

                                //如果附近不是 dd ，或者附近的 dd 元素是禁用状态，则进入递归查找
                                if ((!nearDd[0] || nearDd.hasClass(DISABLED)) && nearElem[0]) {
                                    return setThisDd(prevNext, nearElem);
                                }

                                nearDd.addClass(THIS).siblings().removeClass(THIS); //标注样式
                                followScroll(); //定位滚动条
                            };

                            if (keyCode === 38) setThisDd('prev'); //Up 键
                            if (keyCode === 40) setThisDd('next'); //Down 键

                            //Enter 键
                            if (keyCode === 13) {
                                e.preventDefault();
                                dl.children('dd.' + THIS).trigger('click');
                            }
                        });

                        //检测值是否不属于 select 项
                        var notOption = function(value, callback, origin) {
                            var num = 0;
                            layui.each(dds, function() {
                                var othis = $(this),
                                    text = othis.text(),
                                    not = text.indexOf(value) === -1;
                                if (value === '' || (origin === 'blur') ? value !== text : not) num++;
                                origin === 'keyup' && othis[not ? 'addClass' : 'removeClass'](HIDE);
                            });
                            var none = num === dds.length;
                            return callback(none), none;
                        };

                        //搜索匹配
                        var search = function(e) {
                            var value = this.value,
                                keyCode = e.keyCode;

                            if (keyCode === 9 || keyCode === 13 ||
                                keyCode === 37 || keyCode === 38 ||
                                keyCode === 39 || keyCode === 40
                            ) {
                                return false;
                            }

                            notOption(value, function(none) {
                                if (none) {
                                    dl.find('.' + NONE)[0] || dl.append('<p class="' + NONE + '">无匹配项</p>');
                                } else {
                                    dl.find('.' + NONE).remove();
                                }
                            }, 'keyup');

                            if (value === '') {
                                dl.find('.' + NONE).remove();
                            }

                            followScroll(); //定位滚动条
                        };

                        if (isSearch) {
                            input.on('keyup', search).on('blur', function(e) {
                                var selectedIndex = select[0].selectedIndex;

                                thatInput = input; //当前的 select 中的 input 元素
                                initValue = $(select[0].options[selectedIndex]).html(); //重新获得初始选中值

                                //如果是第一项，且文本值等于 placeholder，则清空初始值
                                if (selectedIndex === 0 && initValue === input.attr('placeholder')) {
                                    initValue = '';
                                };

                                setTimeout(function() {
                                    notOption(input.val(), function(none) {
                                        initValue || input.val(''); //none && !initValue
                                    }, 'blur');
                                }, 200);
                            });
                        }

                        //选择
                        dds.on('click', function() {
                            var othis = $(this),
                                value = othis.attr('lay-value');
                            var filter = select.attr('lay-filter'); //获取过滤器

                            if (othis.hasClass(DISABLED)) return false;

                            if (othis.hasClass('layui-select-tips')) {
                                input.val('');
                            } else {
                                input.val(othis.text());
                                othis.addClass(THIS);
                            }

                            othis.siblings().removeClass(THIS);
                            select.val(value).removeClass('layui-form-danger')
                            layui.event.call(this, MOD_NAME, 'select(' + filter + ')', {
                                elem: select[0],
                                value: value,
                                othis: reElem
                            });

                            hideDown(true);
                            return false;
                        });

                        reElem.find('dl>dt').on('click', function(e) {
                            return false;
                        });

                        $(document).off('click', hide).on('click', hide); //点击其它元素关闭 select
                    }

                    selects.each(function(index, select) {
                        if(select.selectedIndex != undefined && select.options){
                            var othis = $(this),
                            hasRender = othis.next('.' + CLASS),
                            disabled = this.disabled,
                            value = select.value;
                            var selected;
                            var optionsFirst;
                            if(select.selectedIndex >=0 ){
                                selected = (select.options.length > 0 ? $(select.options[select.selectedIndex]) : 0); //获取当前选中项
                                optionsFirst = select.options[0];
                            } else {
                                selected = 0;
                                optionsFirst = '';
                            }


                        if (typeof othis.attr('lay-ignore') === 'string') return othis.show();

                        var isSearch = typeof othis.attr('lay-search') === 'string',
                            placeholder = optionsFirst ? (
                                optionsFirst.value ? TIPS : (optionsFirst.innerHTML || TIPS)
                            ) : TIPS;

                        //替代元素
                        var reElem = $(['<div class="' + (isSearch ? '' : 'layui-unselect ') + CLASS, (disabled ? ' layui-select-disabled' : '') + '">', '<div class="' + TITLE + '">', ('<input type="text" placeholder="' + placeholder + '" ' +
                                ('value="' + (value ? selected.html() : '') + '"') //默认值
                                +
                                (isSearch ? '' : ' readonly') //是否开启搜索
                                +
                                ' class="layui-input' +
                                (isSearch ? '' : ' layui-unselect') +
                                (disabled ? (' ' + DISABLED) : '') + '">') //禁用状态
                            , '<i class="layui-edge"></i></div>', '<dl class="layui-anim layui-anim-upbit' + (othis.find('optgroup')[0] ? ' layui-select-group' : '') + '">',
                            function(options) {
                                var arr = [];
                                layui.each(options, function(index, item) {
                                    if (index === 0 && !item.value) {
                                        arr.push('<dd lay-value="" class="layui-select-tips">' + (item.innerHTML || TIPS) + '</dd>');
                                    } else if (item.tagName.toLowerCase() === 'optgroup') {
                                        arr.push('<dt>' + item.label + '</dt>');
                                    } else {
                                        arr.push('<dd lay-value="' + item.value + '" class="' + (value === item.value ? THIS : '') + (item.disabled ? (' ' + DISABLED) : '') + '">' + item.innerHTML + '</dd>');
                                    }
                                });
                                arr.length === 0 && arr.push('<dd lay-value="" class="' + DISABLED + '">没有选项</dd>');
                                return arr.join('');
                            }(othis.find('*')) + '</dl>', '</div>'
                        ].join(''));

                        hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
                        othis.after(reElem);
                        events.call(this, reElem, disabled, isSearch);
                        }
                    });
                }

                //复选框/开关
                ,
                checkbox: function() {
                    var CLASS = {
                            checkbox: ['layui-form-checkbox', 'layui-form-checked', 'checkbox'],
                            _switch: ['layui-form-switch', 'layui-form-onswitch', 'switch']
                        },
                        checks = elemForm.find('input[type=checkbox]')

                    , events = function(reElem, RE_CLASS) {
                        var check = $(this);

                        //勾选
                        reElem.on('click', function() {
                            var filter = check.attr('lay-filter') //获取过滤器
                                ,
                                text = (check.attr('lay-text') || '').split('|');

                            if (check[0].disabled) return;

                            check[0].checked ? (
                                check[0].checked = false, reElem.removeClass(RE_CLASS[1]).find('em').text(text[1])
                            ) : (
                                check[0].checked = true, reElem.addClass(RE_CLASS[1]).find('em').text(text[0])
                            );

                            layui.event.call(check[0], MOD_NAME, RE_CLASS[2] + '(' + filter + ')', {
                                elem: check[0],
                                value: check[0].value,
                                othis: reElem
                            });
                        });
                    }

                    checks.each(function(index, check) {
                        var othis = $(this),
                            skin = othis.attr('lay-skin'),
                            text = (othis.attr('lay-text') || '').split('|'),
                            disabled = this.disabled;
                        if (skin === 'switch') skin = '_' + skin;
                        var RE_CLASS = CLASS[skin] || CLASS.checkbox;

                        if (typeof othis.attr('lay-ignore') === 'string') return othis.show();

                        //替代元素
                        var hasRender = othis.next('.' + RE_CLASS[0]),
                            reElem = $(['<div class="layui-unselect ' + RE_CLASS[0], (check.checked ? (' ' + RE_CLASS[1]) : '') //选中状态
                                , (disabled ? ' layui-checkbox-disbaled ' + DISABLED : '') //禁用状态
                                , '"', (skin ? ' lay-skin="' + skin + '"' : '') //风格
                                , '>',
                                function() { //不同风格的内容
                                    var title = check.title.replace(/\s/g, ''),
                                        type = {
                                            //复选框
                                            checkbox: [
                                                (title ? ('<span>' + check.title + '</span>') : ''), '<i class="layui-icon layui-icon-ok"></i>'
                                            ].join('')

                                            //开关
                                            ,
                                            _switch: '<em>' + ((check.checked ? text[0] : text[1]) || '') + '</em><i></i>'
                                        };
                                    return type[skin] || type['checkbox'];
                                }(), '</div>'
                            ].join(''));

                        hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
                        othis.after(reElem);
                        events.call(this, reElem, RE_CLASS);
                    });
                }

                //单选框
                ,
                radio: function() {
                    var CLASS = 'layui-form-radio',
                        ICON = ['&#xe643;', '&#xe63f;'],
                        radios = elemForm.find('input[type=radio]')

                    , events = function(reElem) {
                        var radio = $(this),
                            ANIM = 'layui-anim-scaleSpring';

                        reElem.on('click', function() {
                            var name = radio[0].name,
                                forms = radio.parents(ELEM);
                            var filter = radio.attr('lay-filter'); //获取过滤器
                            var sameRadio = forms.find('input[name=' + name.replace(/(\.|#|\[|\])/g, '\\$1') + ']'); //找到相同name的兄弟

                            if (radio[0].disabled) return;

                            layui.each(sameRadio, function() {
                                var next = $(this).next('.' + CLASS);
                                this.checked = false;
                                next.removeClass(CLASS + 'ed');
                                next.find('.layui-icon').removeClass(ANIM).html(ICON[1]);
                            });

                            radio[0].checked = true;
                            reElem.addClass(CLASS + 'ed');
                            reElem.find('.layui-icon').addClass(ANIM).html(ICON[0]);

                            layui.event.call(radio[0], MOD_NAME, 'radio(' + filter + ')', {
                                elem: radio[0],
                                value: radio[0].value,
                                othis: reElem
                            });
                        });
                    };

                    radios.each(function(index, radio) {
                        var othis = $(this),
                            hasRender = othis.next('.' + CLASS),
                            disabled = this.disabled;

                        if (typeof othis.attr('lay-ignore') === 'string') return othis.show();
                        hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender

                        //替代元素
                        var reElem = $(['<div class="layui-unselect ' + CLASS, (radio.checked ? (' ' + CLASS + 'ed') : '') //选中状态
                            , (disabled ? ' layui-radio-disbaled ' + DISABLED : '') + '">' //禁用状态
                            , '<i class="layui-anim layui-icon">' + ICON[radio.checked ? 0 : 1] + '</i>', '<div>' + function() {
                                var title = radio.title || '';
                                if (typeof othis.next().attr('lay-radio') === 'string') {
                                    title = othis.next().html();
                                    othis.next().remove();
                                }
                                return title
                            }() + '</div>', '</div>'
                        ].join(''));

                        othis.after(reElem);
                        events.call(this, reElem);
                    });
                }
            };
        type ? (
            items[type] ? items[type]() : hint.error('不支持的' + type + '表单渲染')
        ) : layui.each(items, function(index, item) {
            item();
        });
        return that;
    };

    var validField = function(item) {
        var isValid = true, //验证不通过状态
            verify = form.config.verify, //验证规则
            DANGER = 'layui-form-danger'; //警示样式

        var othis = $(item),
            vers = othis.attr('lay-verify').split('|'),
            value = othis.val();
        // 如果是checkbox，进行校验
        if (othis.attr('lay-form-type') && othis.attr('lay-form-type') == 'checkbox') {
            var formName = othis.attr('lay-form-filter');
            var checkedVal = [];
            othis.find('[name="' + formName + '"]:checked').each(function() {
                checkedVal.push($(this).val())
            });
            value = checkedVal.join(',');
        }
        // 如果是多选下拉，进行校验
        if(othis.attr('lay-form-type') && othis.attr('lay-form-type') == 'mulSelect'){
            var formName = othis.attr('lay-form-filter');
            var checkedVal = [];
            othis.find('[sid="' + formName + '"]').each(function() {
                checkedVal.push($(this).data("value"));
            });
            value = checkedVal.join(',');
        }

        othis.removeClass(DANGER); //移除警示样式

        //遍历元素绑定的验证规则
        for (var i = 0; i < vers.length; i++) {
            var thisVer = vers[i];

            var isTrue, //是否命中校验
                errorText = '', //错误提示文本
                isFn = typeof verify[thisVer] === 'function';

            //匹配验证规则
            if (verify[thisVer]) {
                var isTrue = isFn ? errorText = verify[thisVer](value, item) : !verify[thisVer][0].test(value);
                errorText = errorText || verify[thisVer][1];

                if (thisVer === 'required') {
                    errorText = othis.attr('lay-reqText') || errorText;
                }

                //如果是必填项或者非空命中校验，则阻止提交，弹出提示
                if (isTrue) {
                    //提示层风格
                    othis.addClass(DANGER).attr('errorText', errorText);
                    if(othis.is(':focus')){
                        addTips(othis,errorText);
                    }
                    othis.hover(function() {
                        addTips(othis,errorText);
                    }, function() {
                        layer.closeAll('tips')
                    });
                    isValid = false;
                } else {
                    layer.closeAll('tips'); //关闭短时间内的tips
                    othis.attr('errorText', '').unbind('mouseenter').unbind('mouseleave');;
                }
            }
            if (!isValid) break;
        };
        return isValid;
    }
    function addTips(othis,errorText){
        layer.tips(errorText, function() {
            if (typeof othis.attr('lay-ignore') !== 'string') {
                if (othis[0].tagName.toLowerCase() === 'select' || /^checkbox|radio$/.test(othis[0].type)) {
                    return othis.next();
                }
            }
            return othis;
        }(), { tips: 3 });
    }
    var validAllForm = function(elem) {
        var stop = false;
        var verifyElem = elem.find('*[lay-verify]');
        //开始校验
        layui.each(verifyElem, function(index, item) {
            var isValid = validField(item);
            if (isValid === false) {
                //非移动设备自动定位焦点
                if (stop === false && !device.android && !device.ios) {
                    $(item).is(':visible') && $('.pageContent').scrollTop($('.pageContent').scrollTop() + $(item).offset().top - 120) && setTimeout(function() {
                        item.focus();
                        var othis = $(item);
                        var errorText = $(item).attr('errorText');
                        addTips(othis,errorText);
                    }, 7);
                }
                stop = true;
            }
        });
        return !stop;
    }

    //表单提交校验
    var submit = function() {
        var stop = null //验证不通过状态
            ,
            field = {} //字段集合
            ,
            button = $(this) //当前触发的按钮
            ,
            elem = button.parents(ELEM) //当前所在表单域
            ,
            verifyElem = elem.find('*[lay-verify]') //获取需要校验的元素
            ,
            formElem = button.parents('form')[0] //获取当前所在的 form 元素，如果存在的话
            ,
            filter = button.attr('lay-filter'); //获取过滤器

        stop = validAllForm(elem);

        if (stop) return false;

        //获取当前表单值
        field = form.getValue(null, elem);

        //返回字段
        return layui.event.call(this, MOD_NAME, 'submit(' + filter + ')', {
            elem: this,
            form: formElem,
            field: field
        });
    };

    // 手动触发校验
    var validForm = function(filter) {
        var formElem = $(ELEM + '[lay-filter="' + filter + '"]');
        console.log(formElem);
        var isValid = validAllForm(formElem);
        return isValid;
    }



    Form.prototype.validForm = validForm;
    Form.prototype.validField = function(dom) {
        return validField($(dom)[0]);
    };
    Form.prototype.resetFormValid = function(filter) {
        $(ELEM + '[lay-filter="' + filter + '"]').find('.layui-form-danger').each(function(_, item) {
            $(item).removeClass(layui - form - danger).attr('errortext', '');
        })
    }

    //自动完成渲染
    var form = new Form(),
        $dom = $(document),
        $win = $(window);

    form.render();

    //监听表单值改变时触发校验
    $(ELEM).find('*[lay-verify]').each(function(index, item) {
        $(item).on('keyup', function() {
            validField(item);
        })
        $(item).on('change', function() {
            var isValid = validField(item);
            if (!isValid) {
                var errorText = $(item).attr('errortext');
                var othis = $(this);
                addTips(othis,errorText);
            }
        })
    })

    // 监听checkbox的改变
    $('[lay-form-type=checkbox][lay-verify]').each(function() {
        var formFilter = $(this).attr('lay-form-filter');
        form.on('checkbox(' + formFilter + ')', function(data) {
            validField($('[lay-form-type=checkbox][lay-verify][lay-form-filter=' + formFilter + ']')[0]);
        })
    })

    // --------- 因多选下拉为动态创建,校验监听逻辑在mySelect.js中 --------

    //表单reset重置渲染
    $dom.on('reset', ELEM, function() {
        var filter = $(this).attr('lay-filter');
        setTimeout(function() {
            form.render(null, filter);
        }, 50);
    })

    //表单提交事件
    $dom.on('submit', ELEM, submit)
        .on('click', '*[lay-submit]', submit);

    
    exports(MOD_NAME, form);
});