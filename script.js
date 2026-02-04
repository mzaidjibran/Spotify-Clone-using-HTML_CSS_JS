console.log("Let's write some JavaScript");

async function main() {
    let songs = await getSongs();
    console.log(songs)

    //play 1st song

    var audio = new Audio(songs[0]);
    audio.play();

    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        console.log(duration)
    });
}

