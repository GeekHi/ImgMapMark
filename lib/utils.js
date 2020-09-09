    // 工具方法
    function getQueryString(name) {
        var getParam = function (keyname) {
          var reg = new RegExp("(^|&)" + keyname + "=([^&]*)(&|$)", "i");
          var r = decodeURIComponent(window.location.search).substr(1).match(reg);
          if (r != null) return unescape(r[2]);
          return null;
        }
        if (typeof name == 'string') return getParam(name);
        else {
          var result = {};
          for (var i = 0; i < name.length; i++) {
            var keyName = name[i];
            result[keyName] = getParam(keyName);
          }
          return result;
        }
    }

    