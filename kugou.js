!function () {
  function jsonp(url, callback) {
    var script = document.createElement('script');
    var fnname= 'jsonp_' + Math.random().toString().replace('.', '');
    var urlm = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback='+fnname;
    script.src = urlm;
    window[fnname] = function () {
      delete window[fnname];
      callback.apply(null, arguments);
    }
    document.body.appendChild(script);
    script.onload = function () {
      document.body.removeChild(script);
    }
    return {
      abort:function(){
        try{
          script.remove();
          script=null;
        }catch(e){

        }

      }
    }
  }

  function getSongDetails(id, album_id, callback) {
    var url = "https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash=" + id.toUpperCase() +
      "&dfid=2mScsJ16ucV81qLdzD238ELf&appid=1014&mid=1b211caf58cd1e1fdfea5a4657cc21f5&platid=4"+
      (album_id?("&album_id=" + album_id):"")+
      "&_=" + Date.now();
    var a=jsonp(url, function (res) {
      if(res.err_code==0){
        callback({
          title: res.data.audio_name,
          songname: res.data.song_name,
          artist: res.data.author_name,
          lrc: parseLrc(res.data.lyrics),
          url: res.data.play_url,
          album: res.data.album_name,
          img: res.data.img,
          lrcstr:res.data.lyrics,
          ispriviage: res.data.privilege >= 10,
        });
      }else{
        callback({
          error:'获取歌曲失败',
          code:res.err_code
        })
      }

    });
    return a;
  }

  function parseLrc(lrc) {
    var oLRC=[];
    if (lrc.length == 0) return;
    var lrcs = lrc.split('\n');//用回车拆分成数组
    for (var i in lrcs) {//遍历歌词数组
      lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
      var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
      var s = t.split(":");//分离:前后文字
      if (!isNaN(parseInt(s[0]))) { //是数值
        var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
        var start = 0;
        for (var k in arr) {
          start += arr[k].length; //计算歌词位置
        }
        var content = lrcs[i].substring(start);//获取歌词内容
        for (var k in arr) {
          var t = arr[k].substring(1, arr[k].length - 1);//取[]间的内容
          var s = t.split(":");//分离:前后文字
          oLRC.push({//对象{t:时间,c:歌词}加入ms数组
            t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
            c: content
          });
        }
      }
    }
    oLRC.sort(function (a, b) {//按时间顺序排序
      return a.t - b.t;
    });
    var r={};
    oLRC.forEach(function(a){
      r[a.t]=a.c;
    })
    return r;
  }
  window.kugou = {
    getSongDetails:getSongDetails,
    parseLrc:parseLrc
  }
}();