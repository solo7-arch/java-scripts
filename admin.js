var adminler= [
    "admin authları",
    "",
    ""
];
var oadminler = new Set();

room.onPlayerJoin = (player) => {
if(adminler.includes(player.auth)){
    oadminler.add(player.id);
    room.setPlayerAdmin(player.id,true);
    room.sendAnnouncement(player.name+" İsimli Adminimiz Odaya Düzen Sağlamaya Geldi .",null,0x8514C6,"small",2);
    room.sendAnnouncement("Bir AdminOdaya Giriş Yaptı.",null,0x8514C6,"small",2);
}
}

room.onPlayerChat = function(player,message){ 
     if(oadminler.has(player.id) == true) {
     room.sendAnnouncement(" ADMİN  "+ player.name +": "+ message, null, 0xAF0C25, 'bold', 1);
     return false;
}
}