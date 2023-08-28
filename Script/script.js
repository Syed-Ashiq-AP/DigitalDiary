let diary = {}

function load_data(){
    let cy = new Date().getFullYear()
    document.getElementById("dyinp").value = cy
    document.getElementById("dyinp").min = cy
    document.getElementById("diary-list").innerHTML=''
    for(const [k,v] of Object.entries(localStorage)){
        let tdata = JSON.parse(v)
        diary[k]=tdata.year
        let yr =  parseInt(tdata.year)
        document.getElementById("diary-list").insertAdjacentHTML('beforeend',
        `
        <div class="diary">
            <h3>`+k+`</h3>
            <p>Year:`+yr+`</p>
            <div>
                <button onclick="openDiary('`+k+`')" class="diary-btn">Use</button>
            </div>
        </div>
        `)
    }
    if(Object.keys(diary).length!=0){
        document.getElementsByClassName("diary-nf")[0].style.display="none"
        document.getElementsByClassName("diary-list")[0].style.display=""
    }else{
        document.getElementsByClassName("diary-nf")[0].style.display=""
        document.getElementsByClassName("diary-list")[0].style.display="none"

    }

}

function sh_addDiary(){
    document.getElementById("diary-a-d").style.display="flex"
    document.getElementById("ad_btn").style.display="none"
}

function hd_addDiary(){
    document.getElementById("diary-a-d").style.display="none"
    document.getElementById("ad_btn").style.display="flex"

}

function addDiary(){
    let dname = document.getElementById("dninp").value
    let dyear = document.getElementById("dyinp").value
    if(Object.keys(diary).includes(dname) == false && dname!=''){
        let data = {diary:dname,year:dyear}
        localStorage.setItem(dname,JSON.stringify(data))
        load_data()
    }
}

function openDiary(dn){
    location.replace(location.origin+"/diary?diary="+dn)
}

load_data()