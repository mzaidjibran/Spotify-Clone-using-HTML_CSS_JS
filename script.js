console.log("Let's write some JavaScript");

let currentSongs = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid Input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.textContent.trim())
        }

    }
    return songs
}

getSongs()

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSongs.src = "/songs/" + track
    if (!pause) {
        currentSongs.play()
        play.src = "pause.svg"
    }


    document.querySelector(".songInfo").innerHTML = track
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
}

async function main() {




    // Get the list of songs.
    let songs = await getSongs()
    playMusic(songs[0], true)


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                        <img src="music.svg" class="invert">
                        <div class="info">
                            <div>
                                 ${song}
                            </div>
                            <div>Zaid</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img src="play.svg" class="invert">
                        </div>
    </li>`;
    }

    //attach event listner to each song.
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })

    //attach event listner to play,next and previous buttons

    play.addEventListener("click", () => {
        if (currentSongs.paused) {
            currentSongs.play()
            play.src = "pause.svg"
        }
        else {
            currentSongs.pause()
            play.src = "play.svg"
        }
    }
    )
    //time update event

    currentSongs.addEventListener("timeupdate", () => {
        console.log(currentSongs.currentTime, currentSongs.duration);
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSongs.currentTime)}/${secondsToMinutesSeconds(currentSongs.duration)}`
        document.querySelector(".circle").style.left = (currentSongs.currentTime / currentSongs.duration) * 100 + "%";
    })

    //add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSongs.currentTime = ((currentSongs.duration) * percent) / 100
    })

    //Add an event listner to hamberg

    const leftBox = document.querySelector(".left_box");

    document.querySelector(".hamburger").addEventListener("click", () => {
        leftBox.classList.add("active");
    });

    document.querySelector(".close").addEventListener("click", () => {
        leftBox.classList.remove("active");
    });

    const hamburger = document.querySelector(".hamburger");
    const lefttBox = document.querySelector(".left_box");

    hamburger.addEventListener("click", () => {
        leftBox.classList.add("active");
        hamburger.style.display = "none";
    });

    document.querySelector(".close").addEventListener("click", () => {
        leftBox.classList.remove("active");
        hamburger.style.display = "block";
    });

    previous.addEventListener("click", () => {
        console.log(currentSongs)
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    });

    next.addEventListener("click", () => {
        console.log(currentSongs)
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    });


}

main()


