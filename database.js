let db;
let openrequest=indexedDB.open("mydatabase");
openrequest.addEventListener("success",(e)=>
{
    console.log("db success")
    db=openrequest.result;
})

openrequest.addEventListener("error",(e)=>
{
    console.log("db error");
})

openrequest.addEventListener("upgradeneeded",(e)=>
{
    console.log("db upgraded");
    db=openrequest.result;

    db.createObjectStore("video",{keyPath:"id"});
    db.createObjectStore("image",{keyPath:"id"});
})