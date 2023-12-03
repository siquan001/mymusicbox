# 我的音乐盒子

这是我的音乐盒子，放着我喜欢的音乐，音乐来源于酷狗音乐和网易云音乐（付费音乐自己想办法）

你也可以从我的音乐盒子播放其它音乐，只需要按照如下规则拼接网址：
```
?type=index&i=<歌曲歌单索引> 
根据索引播放歌单内歌曲

?type=kugou&hash=<hash>&album_id=<album_id> 
从酷狗音乐获取歌曲播放

?type=netease&id=<id> 
从网易云音乐获取歌曲播放

?type=url&url=<歌曲url>&title=<歌曲标题>&artist=<歌手>&album=<专辑>&img=<歌曲封面URL>
从歌曲链接播放

当type!=index时，会判断歌曲是否存在歌单中
```

代码可以拿走。

<https://siquan001.github.io/mymusicbox>

## 感谢API提供站点

故梦API [api.gumengya.com](https://api.gumengya.com)