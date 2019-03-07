$(function(){
  var script = $("<script src='https://cdn.jsdelivr.net/npm/flv.js@latest/dist/flv.min.js'>");
  $("body").append(script);

  var intervalID = setInterval(function(){
    if($("#channels tr").size()>1 && typeof flvjs != "undefined"){
      clearInterval(intervalID);
      onChannelLoad();
    }
  },1000);

  function onChannelLoad(){
    $("#channels tr").each(function(){
      var tr = $(this);
      var columnType = tr.find(".column-type");
      var href = columnType.find("a").attr("href").split("?tip=");
      var tip = href[1];
      var channelID = href[0].split("/")[2];
      if(columnType.text()!="FLV"){
        return;
      }
      var playButton = $("<i class='hls-play-button icon-play-circle'>");
      tr.find(".column-play").append(playButton);
      playButton.click(function(){
        var video_id = "video_"+channelID;
        $("#"+video_id).parents("tr:eq(0)").remove();
        var newtr = $("<tr><td class='hls-player'><video width='640' controls='true'></td></tr>");
        newtr.find("video").attr("id",video_id);
        newtr.insertAfter(tr);
        $(".hls-player").css("display","inline-table");
        playFlv(video_id, "/stream/"+channelID+".flv?tip="+tip);
      });
    });
    $("#channels .column-play").css("width","30px");
    $("#channels .hls-play-button").css("margin-left","6px");
    $("#channels .hls-play-button").css("cursor","pointer");
  }

  function getFlvPlayer(id){
    var video = document.getElementById(id);
    if(!video){
      video = document.createElement("video");
      document.body.appendChild(video);
    }
    return video;
  }

  function playFlv(id, src){
    if(!flvjs.isSupported()) return;
    var video = getFlvPlayer(id);
    var flvPlayer = flvjs.createPlayer({type:"flv","isLive":true,url:src});
    flvPlayer.attachMediaElement(video);
    flvPlayer.load();
    flvPlayer.play();
  }
});
