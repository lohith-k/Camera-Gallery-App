setTimeout(()=>
{
    if(db)
    {
        //video
        let videodbtransaction=db.transaction("video","readonly");
        let videostore=videodbtransaction.objectStore("video");
        let videorequest=videostore.getAll();
        videorequest.onsuccess=(e)=>
        {
            let videoResult=videorequest.result;
            let gallerycontel=document.querySelector(".gallery-cont");
            videoResult.forEach((videoobj)=>
            {
                let mediael=document.createElement("div");
                mediael.classList.add("media-cont");
                mediael.setAttribute("id",videoobj.id);

                let videourl=URL.createObjectURL(videoobj.blobdata);

                mediael.innerHTML=`
                <div class="media">
                <video autoplay loop src="${videourl}"></video>
                </div>
                <div class="action delete">DELETE</div>
                <div class="action download">DOWNLOAD</div>
                `
                gallerycontel.appendChild(mediael);

                let deletebtn=mediael.querySelector(".delete");
                deletebtn.addEventListener("click",deletemedia);
                let downloadbtn=mediael.querySelector(".download");
                downloadbtn.addEventListener("click",downloadmedia);

            })
        }

        //Image
        let imagedbtransaction=db.transaction("image","readonly");
        let imagestore=imagedbtransaction.objectStore("image");
        let imagerequest=imagestore.getAll();
        imagerequest.onsuccess=(e)=>
        {
            let imageResult=imagerequest.result;
            let gallerycontel=document.querySelector(".gallery-cont");
            imageResult.forEach((imageobj)=>
            {
                let mediael=document.createElement("div");
                mediael.classList.add("media-cont");
                mediael.setAttribute("id",imageobj.id);

                let imageurl=imageobj.url;
                console.log(imageobj)
                mediael.innerHTML=`
                <div class="media">
                <img src="${imageurl}"></img>
                </div>
                <div class="action delete">DELETE</div>
                <div class="action download">DOWNLOAD</div>
                `
                gallerycontel.appendChild(mediael);

                let deletebtn=mediael.querySelector(".delete");
                deletebtn.addEventListener("click",deletemedia);
                let downloadbtn=mediael.querySelector(".download");
                downloadbtn.addEventListener("click",downloadmedia);

            })
        }
    }

},100)


function deletemedia(e)
{
    let id=e.target.parentElement.id;
    if(id.slice(0,3)=="vid")
    {
        let videodbtransaction=db.transaction("video","readwrite");
        let videostore=videodbtransaction.objectStore("video");
        videostore.delete(id);
    }
    else if(id.slice(0,3)=="img")
    {
        let imagedbtransaction=db.transaction("image","readwrite");
        let imagestore=imagedbtransaction.objectStore("image");
        imagestore.delete(id);
    }

    e.target.parentElement.remove();
}

function downloadmedia(e)
{
    let id=e.target.parentElement.id;
    if(id.slice(0,3)=="vid")
    {
        let videodbtransaction=db.transaction("video","readwrite");
        let videostore=videodbtransaction.objectStore("video");
        let videorequest=videostore.get(id);
        videorequest.onsuccess=(e)=>
        {
            let videoresult=videorequest.result;
            let videourl=URL.createObjectURL(videoresult.blobdata);
            let a=document.createElement("a");
            a.href=videourl;
            a.download="stream.mp4";
            a.click();
        }
    }
    else if(id.slice(0,3)=="img")
    {
        let imagedbtransaction=db.transaction("image","readwrite");
        let imagestore=imagedbtransaction.objectStore("image");
        let imagerequest=imagestore.get(id);
        imagerequest.onsuccess=(e)=>
        {
            let imageresult=imagerequest.result;
            let imageurl=imageresult.url;
            let a=document.createElement("a");
            a.href=imageurl;
            a.download="image.jpg";
            a.click();
        }
    }

    
}