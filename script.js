let videocontel=document.querySelector(".video-cont");
let videoel=document.querySelector(".video-cont video");
let recordcont=document.querySelector(".recorder-cont");
let capturecont=document.querySelector(".capture-cont");
let recordbtn=document.querySelector(".recorder-btn");
let capturebtn=document.querySelector(".capture-btn");
let filterlayerel=document.querySelector(".filterlayer");
let filterel=document.querySelectorAll(".filter");

let filtercolor="transparent";

let bgcolors={
    yellow:"#a58f2a63",
    brown:"#a52a2a75",
    blue:"#2c355678",
    transparent:"transparent"
}
let recordflag=false;

let recorder;
let constraints={
    video:true,
    audio:true
}
let chunks=[]
let counter=0;


navigator.mediaDevices.getUserMedia(constraints).then((stream)=>
{
    videoel.srcObject=stream;

    recorder=new MediaRecorder(stream);
    recorder.addEventListener("start",(e)=>
    {
        chunks=[];
    })
    recorder.addEventListener("dataavailable",(e)=>
    {
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",()=>
    {
        
        let blob=new Blob(chunks,{type:"video/mp4"});
        let videoURL=URL.createObjectURL(blob);
        if(db)
        {
            let videoId=shortid();
            let dbtransaction=db.transaction("video","readwrite");
            let videostore=dbtransaction.objectStore("video");
            let videoentry={
                id:`vid-${videoId}`,
                blobdata:blob
            }
            videostore.add(videoentry);
        }

        // let a=document.createElement("a");
        // a.href=videoURL;
        // a.download="stream.mp4";
        // a.click();
    })
})

recordbtn.addEventListener("click",(e)=>
{
    recordflag=!recordflag;

    if(recordflag==true)
    {
        startrecording();
    }
    else
    {
        stoprecording();
    }

})

capturebtn.addEventListener("click",(e)=>
{
    let canvas=document.createElement("canvas");
    canvas.width=videoel.videoWidth;
    canvas.height=videoel.videoHeight;
    let ctx=canvas.getContext("2d");
    capturing();
    ctx.drawImage(videoel,0,0,canvas.width,canvas.height);
    ctx.fillStyle =filtercolor ;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let imageURL=canvas.toDataURL();

    if(db)
    {
        let imageId=shortid();
        let dbtransaction=db.transaction("image","readwrite");
        let imagestore=dbtransaction.objectStore("image");
        let imageentry={
            id:`img-${imageId}`,
            url:imageURL
        }
        imagestore.add(imageentry);
    }

    // let a=document.createElement("a");
    // a.href=imageURL;
    // a.download="image.jpg";
    // a.click();
})

let timerel=document.querySelector(".timer");
let timer;

function startrecording()
{
    recorder.start();
    updatetime();
    timerel.style.display="block";
    recordbtn.classList.add("active-record");
}

function stoprecording()
{
    recorder.stop();
    clearInterval(timer);
    timerel.innerText="00:00:00";
    timerel.style.display="none";
    recordbtn.classList.remove("active-record");
}

function capturing()
{
    capturebtn.classList.add("active-capture");

    setTimeout(()=>
    {
        capturebtn.classList.remove("active-capture");
    },1000)
}


function updatetime()
{
    function displaytime()
    {
        let currtime=counter;
        let hours=Number.parseInt(currtime/3600);
        currtime=currtime%3600;
        let minutes=Number.parseInt(currtime/60);
        currtime=currtime%60;
        let seconds=Number.parseInt(currtime);

        hours=hours<10?`${0}${hours}`:hours;
        minutes=minutes<10?`${0}${minutes}`:minutes;
        seconds=seconds<10?`${0}${seconds}`:seconds;

        timerel.innerText=`${hours}:${minutes}:${seconds}`;
        counter++;
    }
    timer=setInterval(displaytime,1000);
}


filterel.forEach((eachfilter)=>
{
    eachfilter.addEventListener("click",()=>
    {
        updatefilter(eachfilter.classList[1]);
    })
})

function updatefilter(color)
{
    filtercolor=bgcolors[color];
    filterlayerel.style.backgroundColor=bgcolors[color];
}