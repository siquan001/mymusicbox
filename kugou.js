!function () {
  function xhr(url, callback,err) {
    // if(url.indexOf('api.epdd.cn')!=-1) url='https://util.siquan.tk/api/cors?url='+encodeURIComponent(url);
    var x=new XMLHttpRequest();
    x.open('GET', url, true);
    x.onreadystatechange = function () {
      if (x.readyState == 4 && x.status == 200) {
        callback(JSON.parse(x.responseText));
      }
    }
    x.onerror = function () {
      err(x.status);
    }
    x.send();
    return {
      abort:function(){
        x.abort()
      }
    }
  }
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

  function search(keyword, callback, page = 1) {
    var url = 'https://mobiles.kugou.com/api/v3/search/song?format=jsonp&keyword=' + encodeURI(keyword) + '&page=' + page + '&pagesize=30&showtype=1';
    console.log(url);
    var a=jsonp(url, function (data) {
      var res = {
        total: data.data.total,
        page: page,
        songs: [],
      }
      console.log(data.data.info);
      data.data.info.forEach(function (song) {
        var pushed={
          songname: song.songname,
          artist: song.singername,
          id: song.hash,
          ispriviage: song.privilege >= 10,
          album_id: song.album_id,
        };
        if(song.filename.match(/【歌词 : .*】/)){
          var matched=song.filename.match(/【歌词 : .*】/);
          pushed.title=song.filename.replace(matched[0], '');
          pushed.matchLyric=matched[0].replace('【歌词 : ', '').replace('】', '');
        }else{
          pushed.title=song.filename;
        }
        res.songs.push(pushed);
      });
      callback(res);
    })
    return a;
  }

  function getSongDetails(id, album_id, callback) {
    var url = "https://api.gmya.net/Api/KuGou?format=json&id=" + id.toUpperCase();
    var a=xhr(url, function (res) {
      if(res.code==200){
        callback({
          title:  res.data.author+' - '+res.data.title,
          songname: res.data.title,
          artist: res.data.author,
          lrc: parseLrc(res.data.lrc),
          url: res.data.url,
          album: '',
          img: res.data.pic,
          lrcstr:res.data.lrc
        });
      }else{
        callback({
          error:'获取歌曲失败',
          code:res.code
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
    search: search,
    getSongDetails
  }
}();