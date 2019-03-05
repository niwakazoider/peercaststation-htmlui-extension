$(function(){
  var script = $("<script src='https://cdn.jsdelivr.net/npm/hls.js@latest'>");
  $("body").append(script);

  var intervalID = setInterval(function(){
    if($("#channels tr").size()>1 && typeof Hls != "undefined"){
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
        playHls(video_id, "/pls/"+channelID+".m3u8?tip="+tip);
      });
    });
    $("#channels .column-play").css("width", "30px");
    $("#channels .hls-play-button").css("margin-left","6px");
    $("#channels .hls-play-button").css("cursor","pointer");
  }

  function getHlsPlayer(id){
    var video = document.getElementById(id);
    if(!video){
      video = document.createElement("video");
      document.body.appendChild(video);
    }
    return video;
  }

  function playHls(id, src){
    var video = getHlsPlayer(id);
    if(Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED,function() {
        video.play();
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata",function() {
        video.play();
      });
    }
  }
});
