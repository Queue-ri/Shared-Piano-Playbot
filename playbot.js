// ==UserScript==
// @name         Shared Piano Playbot
// @namespace    http://qriositylog.com/
// @version      v1.0
// @description  no desc
// @author       Queue-ri
// @match        https://musiclab.chromeexperiments.com/Shared-Piano/
// @icon         https://www.google.com/s2/favicons?domain=chromeexperiments.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://unpkg.com/@tonejs/midi
// ==/UserScript==
/* global parcelRequire */

// const module = import('https://unpkg.com/@tonejs/data'); // 다시 실행이 안됨

var input = document.createElement('input');
input.type = 'file';
input.accept=".mid"
input.onchange = e => {
   var file = e.target.files[0];
   var path = (window.URL || window.webkitURL).createObjectURL(file);
   getData(path)
}
async function getData(path) {
   const data = await Midi.fromUrl(path); // await 안쓰면 Promise 반환됨
   console.log(data);
   bpm = Math.floor(data.header.tempos[0].bpm);
   sus_interval = 480000 / bpm // 2마디
   if (sus_interval > 3) sus_interval /= 2;
   notes = merge(data);
}

// 7옥타브 고정. 옥타브 관련 tst 스니펫과 메모장 참고. 나중에 Promise 처리하기
var setting = document.querySelector('piano-settings');
setting.resizeMode = "manual";
setting.octaves = 7;


// 메트로놈
// let module_metronome = parcelRequire(["O4Jr"], null);
// let metronome = module_metronome.Metronome;
// let Met = new metronome();
// use as 'met.play();' or 'var met_html = Met.render().getHTML();' ...

var html_str = document.getElementById('action-buttons').innerHTML;
var met_html = `
        <piano-metronome>
            <piano-button label="shared_piano_metronome_label">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 37.47 32.86" stroke="#5f6368">
        	        <path fill="none" stroke-width="3" d="M18.63,1.57s0-.05.05-.05l.07,0,.07,0s0,0,.05.05L36,31.14a.14.14,0,0,1,0,.07.31.31,0,0,1,0,.08l-.05.05-.08,0H1.68a.15.15,0,0,1-.08,0l-.05-.05a.31.31,0,0,1,0-.08.14.14,0,0,1,0-.07Z"/>
                    <line x1="18.97" y1="31.73" x2="6.77" y2="10.61" fill="none" stroke-width="3" />
                    <circle cx="5.61" cy="7.39" r="4.11" fill="none" stroke-width="3"/>
                </svg>
            </piano-button>

            <style>
            piano-button {
                left: 8px;
                position: relative;
            }
            piano-button.active {
                --button-bg-color: #0490E7;
                --button-bg-hover-color:  #0490E7;
            }
            svg {
                position: relative;
                top: -1px;
                left: 1px;
            }
            </style>
        </piano-metronome>
`

// document.getElementById('action-buttons').innerHTML = html_str + met_html;
document.getElementById('action-buttons').insertAdjacentHTML('afterbegin', met_html);

// let met_btn = document.querySelectorAll('piano-button')[1];
// met_btn.onclick = function() {
//     Met.enabled = !Met.enabled;
//     met_btn.className = Met.enabled ? "active" : "";
//     document.querySelectorAll('svg')[2].setAttribute("stroke", Met.enabled ? "white" : "#5f6368");
//     Met.updated();
// }


// Transpose Indicator
var transpose_html = `
        <transpose-indicator>
            <div><span><strong>Transpose: </strong></span><span id="offset-value">0</span></div>
            <style>
                transpose-indicator {
                    font-size: 16px;
                    padding: 10px 22px 10px 19px;
                    background-color: white;
                    border: 1px solid rgb(204, 204, 204);
                    border-radius: 6px;
                    width: auto;
                }
            </style>
        </transpose-indicator>
`
document.querySelector('#footer-config > piano-instrument-selector').insertAdjacentHTML('afterend', transpose_html);


// https://musiclab.chromeexperiments.com/Shared-Piano
// dev tool에서 돌리면 width 따라 undefine 인식될 수 있으니 주의
// p# = piano octave # (ex. p3 == piano octave 3)
let p = document.querySelector('#piano > piano-keyboard').shadowRoot.querySelectorAll("#container > piano-keyboard-octave");
let p1 = p[0].shadowRoot;
let p2 = p[1].shadowRoot;
let p3 = p[2].shadowRoot;
let p4 = p[3].shadowRoot;
let p5 = p[4].shadowRoot;
let p6 = p[5].shadowRoot;
let p7 = p[6].shadowRoot;
// console.log(t0);

let w1 = p1.querySelectorAll("#container > #white-notes > piano-keyboard-note");
let w2 = p2.querySelectorAll("#container > #white-notes > piano-keyboard-note");
let w3 = p3.querySelectorAll("#container > #white-notes > piano-keyboard-note");
let w4 = p4.querySelectorAll("#container > #white-notes > piano-keyboard-note");
let w5 = p5.querySelectorAll("#container > #white-notes > piano-keyboard-note");
let w6 = p6.querySelectorAll("#container > #white-notes > piano-keyboard-note");
let w7 = p7.querySelectorAll("#container > #white-notes > piano-keyboard-note");

let b1 = p1.querySelectorAll("#container > #black-notes > piano-keyboard-note");
let b2 = p2.querySelectorAll("#container > #black-notes > piano-keyboard-note");
let b3 = p3.querySelectorAll("#container > #black-notes > piano-keyboard-note");
let b4 = p4.querySelectorAll("#container > #black-notes > piano-keyboard-note");
let b5 = p5.querySelectorAll("#container > #black-notes > piano-keyboard-note");
let b6 = p6.querySelectorAll("#container > #black-notes > piano-keyboard-note");
let b7 = p7.querySelectorAll("#container > #black-notes > piano-keyboard-note");
// console.log(b) // only idx 1,2,4,5,6 avail for black notes

let C1 = w1[0];
let CS1 = b1[1];
let D1 = w1[1];
let DS1 = b1[2];
let E1 = w1[2];
let F1 = w1[3];
let FS1 = b1[4];
let G1 = w1[4];
let GS1 = b1[5];
let A1 = w1[5];
let AS1 = b1[6];
let B1 = w1[6];

let C2 = w2[0];
let CS2 = b2[1];
let D2 = w2[1];
let DS2 = b2[2];
let E2 = w2[2];
let F2 = w2[3];
let FS2 = b2[4];
let G2 = w2[4];
let GS2 = b2[5];
let A2 = w2[5];
let AS2 = b2[6];
let B2 = w2[6];

let C3 = w3[0];
let CS3 = b3[1];
let D3 = w3[1];
let DS3 = b3[2];
let E3 = w3[2];
let F3 = w3[3];
let FS3 = b3[4];
let G3 = w3[4];
let GS3 = b3[5];
let A3 = w3[5];
let AS3 = b3[6];
let B3 = w3[6];

let C4 = w4[0];
let CS4 = b4[1];
let D4 = w4[1];
let DS4 = b4[2];
let E4 = w4[2];
let F4 = w4[3];
let FS4 = b4[4];
let G4 = w4[4];
let GS4 = b4[5];
let A4 = w4[5];
let AS4 = b4[6];
let B4 = w4[6];

let C5 = w5[0];
let CS5 = b5[1];
let D5 = w5[1];
let DS5 = b5[2];
let E5 = w5[2];
let F5 = w5[3];
let FS5 = b5[4];
let G5 = w5[4];
let GS5 = b5[5];
let A5 = w5[5];
let AS5 = b5[6];
let B5 = w5[6];

let C6 = w6[0];
let CS6 = b6[1];
let D6 = w6[1];
let DS6 = b6[2];
let E6 = w6[2];
let F6 = w6[3];
let FS6 = b6[4];
let G6 = w6[4];
let GS6 = b6[5];
let A6 = w6[5];
let AS6 = b6[6];
let B6 = w6[6];

let C7 = w7[0];
let CS7 = b7[1];
let D7 = w7[1];
let DS7 = b7[2];
let E7 = w7[2];
let F7 = w7[3];
let FS7 = b7[4];
let G7 = w7[4];
let GS7 = b7[5];
let A7 = w7[5];
let AS7 = b7[6];
let B7 = w7[6];


// data:json -> notes:merged data
let data = {};
let notes = []; // merged tracks
let selected_tracks = [];
let bpm;
let sus_interval;

// 서스테인
function sustain() {
    document.dispatchEvent(new KeyboardEvent("keydown",{
        keyCode: 16,
    }));
}

function release() {
    document.dispatchEvent(new KeyboardEvent("keyup",{
        keyCode: 16,
    }));
}


// current note time & sustain event id
var st = 0;
var id;

/* data.tracks[1].notes.forEach(function(note) {
     setTimeout(function(){
             // console.log(note.name, (note.time - st)*1000);
             press_and_schedule(note.name, note.duration*1000);
             st=note.time;
             }, (note.time - st)*1000);
});*/

function nonblock_wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

async function start() {
    sustain();
    id = setInterval(function() {release(); sustain();}, sus_interval);
    for (let i = 0, n = notes.length; i < n; ++i) {
        let duration = (notes[i].time - st)*1000;
        if (duration > 1) await nonblock_wait(duration); // 1ms 정도는 대기 스킵
        st = notes[i].time;
        press_and_schedule(notes[i].name, notes[i].duration*1000);
    }
    clearInterval(id);
}

function merge(data) {
    let notes = data.tracks[0].notes;
    for (let i = 1, len = data.tracks.length; i < len; ++i) {
        let note = data.tracks[i].notes;

        for (let j = 0; j < note.length; ++j) {
            let idx = find_idx(notes, note[j].time);

            notes.splice(idx, 0, note[j]);
        }
    }
    return notes;
}

function find_idx(notes, target) {
   for (let i = 0; i < notes.length; ++i) {
        if (notes[i].time > target) return i;
    }
    return notes.length;
}

// duration (ms)
async function press_and_schedule(key, duration) {
            switch (key) {
            case "C1":
                C1.clicked = true; await nonblock_wait(duration); C1.clicked = false; break;
            case "C#1":
                CS1.clicked = true; await nonblock_wait(duration); CS1.clicked = false; break;
            case "D1":
                D1.clicked = true; await nonblock_wait(duration); D1.clicked = false; break;
            case "D#1":
                DS1.clicked = true; await nonblock_wait(duration); DS1.clicked = false; break;
            case "E1":
                E1.clicked = true; await nonblock_wait(duration); E1.clicked = false; break;
            case "F1":
                F1.clicked = true; await nonblock_wait(duration); F1.clicked = false; break;
            case "F#1":
                FS1.clicked = true; await nonblock_wait(duration); FS1.clicked = false; break;
            case "G1":
                G1.clicked = true; await nonblock_wait(duration); G1.clicked = false; break;
            case "G#1":
                GS1.clicked = true; await nonblock_wait(duration); GS1.clicked = false; break;
            case "A1":
                A1.clicked = true; await nonblock_wait(duration); A1.clicked = false; break;
            case "A#1":
                AS1.clicked = true; await nonblock_wait(duration); AS1.clicked = false; break;
            case "B1":
                B1.clicked = true; await nonblock_wait(duration); B1.clicked = false; break;
            /////////////////////////////
            case "C2":
                C2.clicked = true; await nonblock_wait(duration); C2.clicked = false; break;
            case "C#2":
                CS2.clicked = true; await nonblock_wait(duration); CS2.clicked = false; break;
            case "D2":
                D2.clicked = true; await nonblock_wait(duration); D2.clicked = false; break;
            case "D#2":
                DS2.clicked = true; await nonblock_wait(duration); DS2.clicked = false; break;
            case "E2":
                E2.clicked = true; await nonblock_wait(duration); E2.clicked = false; break;
            case "F2":
                F2.clicked = true; await nonblock_wait(duration); F2.clicked = false; break;
            case "F#2":
                FS2.clicked = true; await nonblock_wait(duration); FS2.clicked = false; break;
            case "G2":
                G2.clicked = true; await nonblock_wait(duration); G2.clicked = false; break;
            case "G#2":
                GS2.clicked = true; await nonblock_wait(duration); GS2.clicked = false; break;
            case "A2":
                A2.clicked = true; await nonblock_wait(duration); A2.clicked = false; break;
            case "A#2":
                AS2.clicked = true; await nonblock_wait(duration); AS2.clicked = false; break;
            case "B2":
                B2.clicked = true; await nonblock_wait(duration); B2.clicked = false; break;
            /////////////////////////////
            case "C3":
                C3.clicked = true; await nonblock_wait(duration); C3.clicked = false; break;
            case "C#3":
                CS3.clicked = true; await nonblock_wait(duration); CS3.clicked = false; break;
            case "D3":
                D3.clicked = true; await nonblock_wait(duration); D3.clicked = false; break;
            case "D#3":
               DS3.clicked = true; await nonblock_wait(duration); DS3.clicked = false; break;
            case "E3":
                E3.clicked = true; await nonblock_wait(duration); E3.clicked = false; break;
            case "F3":
                F3.clicked = true; await nonblock_wait(duration); F3.clicked = false; break;
            case "F#3":
                FS3.clicked = true; await nonblock_wait(duration); FS3.clicked = false; break;
            case "G3":
                G3.clicked = true; await nonblock_wait(duration); G3.clicked = false; break;
            case "G#3":
                GS3.clicked = true; await nonblock_wait(duration); GS3.clicked = false; break;
            case "A3":
                A3.clicked = true; await nonblock_wait(duration); A3.clicked = false; break;
            case "A#3":
                AS3.clicked = true; await nonblock_wait(duration); AS3.clicked = false; break;
            case "B3":
                B3.clicked = true; await nonblock_wait(duration); B3.clicked = false; break;
            /////////////////////////////
            case "C4":
                C4.clicked = true; await nonblock_wait(duration); C4.clicked = false; break;
            case "C#4":
                CS4.clicked = true; await nonblock_wait(duration); CS4.clicked = false; break;
            case "D4":
                D4.clicked = true; await nonblock_wait(duration); D4.clicked = false; break;
            case "D#4":
                DS4.clicked = true; await nonblock_wait(duration); DS4.clicked = false; break;
            case "E4":
                E4.clicked = true; await nonblock_wait(duration); E4.clicked = false; break;
            case "F4":
                F4.clicked = true; await nonblock_wait(duration); F4.clicked = false; break;
            case "F#4":
                FS4.clicked = true; await nonblock_wait(duration); FS4.clicked = false; break;
            case "G4":
                G4.clicked = true; await nonblock_wait(duration); G4.clicked = false; break;
            case "G#4":
                GS4.clicked = true; await nonblock_wait(duration); GS4.clicked = false; break;
            case "A4":
                A4.clicked = true; await nonblock_wait(duration); A4.clicked = false; break;
            case "A#4":
                AS4.clicked = true; await nonblock_wait(duration); AS4.clicked = false; break;
            case "B4":
                B4.clicked = true; await nonblock_wait(duration); B4.clicked = false; break;
            /////////////////////////////
            case "C5":
                C5.clicked = true; await nonblock_wait(duration); C5.clicked = false; break;
            case "C#5":
                CS5.clicked = true; await nonblock_wait(duration); CS5.clicked = false; break;
            case "D5":
                D5.clicked = true; await nonblock_wait(duration); D5.clicked = false; break;
            case "D#5":
                DS5.clicked = true; await nonblock_wait(duration); DS5.clicked = false; break;
            case "E5":
                E5.clicked = true; await nonblock_wait(duration); E5.clicked = false; break;
            case "F5":
                F5.clicked = true; await nonblock_wait(duration); F5.clicked = false; break;
            case "F#5":
                FS5.clicked = true; await nonblock_wait(duration); FS5.clicked = false; break;
            case "G5":
                G5.clicked = true; await nonblock_wait(duration); G5.clicked = false; break;
            case "G#5":
                GS5.clicked = true; await nonblock_wait(duration); GS5.clicked = false; break;
            case "A5":
                A5.clicked = true; await nonblock_wait(duration); A5.clicked = false; break;
            case "A#5":
                AS5.clicked = true; await nonblock_wait(duration); AS5.clicked = false; break;
            case "B5":
                B5.clicked = true; await nonblock_wait(duration); B5.clicked = false; break;
            /////////////////////////////
            case "C6":
                C6.clicked = true; await nonblock_wait(duration); C6.clicked = false; break;
            case "C#6":
                CS6.clicked = true; await nonblock_wait(duration); CS6.clicked = false; break;
            case "D6":
                D6.clicked = true; await nonblock_wait(duration); D6.clicked = false; break;
            case "D#6":
                DS6.clicked = true; await nonblock_wait(duration); DS6.clicked = false; break;
            case "E6":
                E6.clicked = true; await nonblock_wait(duration); E6.clicked = false; break;
            case "F6":
                F6.clicked = true; await nonblock_wait(duration); F6.clicked = false; break;
            case "F#6":
                FS6.clicked = true; await nonblock_wait(duration); FS6.clicked = false; break;
            case "G6":
                G6.clicked = true; await nonblock_wait(duration); G6.clicked = false; break;
            case "G#6":
                GS6.clicked = true; await nonblock_wait(duration); GS6.clicked = false; break;
            case "A6":
                A6.clicked = true; await nonblock_wait(duration); A6.clicked = false; break;
            case "A#6":
                AS6.clicked = true; await nonblock_wait(duration); AS6.clicked = false; break;
            case "B6":
                B6.clicked = true; await nonblock_wait(duration); B6.clicked = false; break;
            //////////////////////////////
            case "C7":
                C7.clicked = true; await nonblock_wait(duration); C7.clicked = false; break;
            case "C#7":
                CS7.clicked = true; await nonblock_wait(duration); CS7.clicked = false; break;
            case "D7":
                D7.clicked = true; await nonblock_wait(duration); D7.clicked = false; break;
            case "D#7":
                DS7.clicked = true; await nonblock_wait(duration); DS7.clicked = false; break;
            case "E7":
                E7.clicked = true; await nonblock_wait(duration); E7.clicked = false; break;
            case "F7":
                F7.clicked = true; await nonblock_wait(duration); F7.clicked = false; break;
            case "F#7":
                FS7.clicked = true; await nonblock_wait(duration); FS7.clicked = false; break;
            case "G7":
                G7.clicked = true; await nonblock_wait(duration); G7.clicked = false; break;
            case "G#7":
                GS7.clicked = true; await nonblock_wait(duration); GS7.clicked = false; break;
            case "A7":
                A7.clicked = true; await nonblock_wait(duration); A7.clicked = false; break;
            case "A#7":
                AS7.clicked = true; await nonblock_wait(duration); AS7.clicked = false; break;
            case "B7":
                B7.clicked = true; await nonblock_wait(duration); B7.clicked = false; break;
            default:
                // console.log("fail", key);
            /////////////////////////////
            }
        }

// Velocity 조정
// document.querySelector('piano-input').keyDown(31.0, 0.4) // HTML에서 G2의 note는 31이라 되어있는데 parameter와 이 값이 동일함. keyDown(float note, float velocity)
// document.querySelector('piano-input').keyUp(31.0)



// start when enter pressed
document.addEventListener("keydown", event => {
    if (event.keyCode == 13) {
        start();
    }

    if (event.key == 'm' && event.ctrlKey) {
        input.click();

        // const midi = window.prompt("midi (json format)", "");
        // data = JSON.parse(midi);
        // bpm = Math.floor(data.header.tempos[0].bpm);
        // sus_interval = 480000 / bpm // 2마디
        // if (sus_interval > 3) sus_interval /= 2;
        // // selected_tracks = [ data.tracks[0], data.tracks[1] ];
        // notes = merge(data);
    }

    if (event.keyCode == 40) { // down
        clearInterval(id);
        sus_interval /= 2;
        id = setInterval(function() {release(); sustain();}, sus_interval);
    }

    if (event.keyCode == 38) { // up
        clearInterval(id);
        sus_interval *= 2;
        id = setInterval(function() {release(); sustain();}, sus_interval);
    }

    if (event.keyCode == 39) { // right
        clearInterval(id);
        sus_interval = 100;
        id = setInterval(function() {release(); sustain();}, 100);
    }

    if (event.keyCode == 37) { // left
        clearInterval(id);
        release();
    }

    if (event.keyCode == 189) { // minus
        (async () => {
            await release_all_key()
                .then(() => {
                in_transpose(-1)
                document.getElementById("offset-value").textContent = offset;
                console.log('transpose offset:',offset);
            });
        })();
    }

    if (event.keyCode == 187) { // plus
        (async () => {
            await release_all_key()
                .then(() => {
                in_transpose(1)
                document.getElementById("offset-value").textContent = offset;
                console.log('transpose offset:',offset);
            });
        })();
    }
});



// in-position transpose
var offset = 0;
function transpose_redefine(offset) {
    let piano_kb = document.querySelector('piano-keyboard')
    piano_kb.keyDown = function({midi: t}, e/*,o=!1*/) {
//      if (o && !r.live) return;
        const i = Math.floor((t-offset) / 12)
        , s = this.shadowRoot.querySelector(`piano-keyboard-octave[octave="${i}"]`);
        null == s || s.keyDown(t, e),
            this.activeNotes.add(t)
    }
    piano_kb.keyUp = function({midi: t}, e) {
        const o = Math.floor((t-offset) / 12)
        , i = this.shadowRoot.querySelector(`piano-keyboard-octave[octave="${o}"]`);
        null == i || i.keyUp(t, e),
            this.activeNotes.delete(t)
    }
}

function in_transpose(command) {
    offset += command;
    p.forEach(bw=>{bw.shadowRoot.querySelectorAll("piano-keyboard-note").forEach(key=>{if(key.note) {key.note += command; key.setAttribute("note", `${key.note}`);}})})
    transpose_redefine(offset);
}

function release_all_key() {
    p.forEach(bw=>{bw.shadowRoot.querySelectorAll("piano-keyboard-note").forEach(key=>{key.clicked=false;})})
    return Promise.resolve();
}



// 스크롤러 오프셋, 컬러조정
// document.querySelector('piano-roll').shadowRoot.querySelector('piano-roll-canvas').noteOffsets = [...]
// document.querySelector('piano-roll').shadowRoot.querySelector('piano-roll-canvas').noteColors = [...]



/* data -> json 파트인데 문제 많아서 일단 보류.
// Reminder: should replace data.fromUrl() bc of the CORS problem
const datafile = fromUrlNoCors("https://download.mail.naver.com/file/download/each/?attachType=normal&mailSN=790&attachIndex=2&virus=1&domain=mail.naver.com&u=hirit808")
const name = data.name

data.tracks.forEach(track => {
  //tracks have notes and controlChanges
  //notes are an array
  const notes = track.notes
  notes.forEach(note => {
    //note.data, note.time, note.duration, note.name
  })
  //the control changes are an object
  //the keys are the CC number
  track.controlChanges[64]
  //they are also aliased to the CC number's common name (if it has one)
  track.controlChanges.sustain.forEach(cc => {
    // cc.ticks, cc.value, cc.time
  })
  //the track also has a channel and instrument
  //track.instrument.name
})

*/
