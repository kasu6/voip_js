'use strict';

let localStream = null;
let peer = null;
let existingCall = null;
//カメラ操作を担当する場所
navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function (stream) {
        // Success
        $('#my-video').get(0).srcObject = stream;
        localStream = stream;
    }).catch(function (error) {
    // Error
    console.error('mediaDevice.getUserMedia() error:', error);
    return;
});
//APIkey,これでskywayのサービスが利用可能になる
peer = new Peer({
    key: '452b47dd-b0d8-479e-a3d4-941e53e2419d',
    debug: 3
});
//発火処理。これで通話の利用が可能となるので相手のIDを表示するように
peer.on('open', function(){
    $('#my-id').text(peer.id);
});
//エラーメッセージ
peer.on('error', function(err){
    alert(err.message);
});
peer.on('close', function(){
});
peer.on('disconnected', function(){
});
//ボタンを押すと発信処理
$('#make-call').submit(function(e){
    e.preventDefault();
    const call = peer.call($('#callto-id').val(), localStream);
    setupCallEventHandlers(call);
});
//ボタンを押すと切断処理
$('#end-call').click(function(){
    existingCall.close();
});
//着信処理、
peer.on('call', function(call){
    call.answer(localStream);
    setupCallEventHandlers(call);
});
//競合を阻止する。先に来た接続を維持しつつ、後から来た接続要求を優先する。
function setupCallEventHandlers(call){
    if (existingCall) {
        existingCall.close();
    };

    existingCall = call;
//相手からの映像と音声が来たら、それぞれ発火
    call.on('stream', function(stream){
        addVideo(call,stream);
        setupEndCallUI();
        $('#their-id').text(call.remoteId);
    });
    call.on('close', function(){
        removeVideo(call.remoteId);
        setupMakeCallUI();
    });
}

//ビデオ要素の再生
function addVideo(call,stream){
    $('#their-video').get(0).srcObject = stream;
}

//ビデオ要素の削除
function removeVideo(peerId){
    $('#'+peerId).remove();
}
//ボタンの表示と非表示
function setupMakeCallUI(){
    $('#make-call').show();
    $('#end-call').hide();
}

function setupEndCallUI() {
    $('#make-call').hide();
    $('#end-call').show();
}
