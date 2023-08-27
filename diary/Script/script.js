const queryString = window.location.search
const params = new URLSearchParams(queryString)
const uniqueId = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    var uid = dateString + randomness
    return uid;
};

let DayOfYear = (d, m) => {
    var now = new Date();
    now.setFullYear(year)
    now.setMonth(m)
    now.setUTCDate(d)
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day
}

let dname = params.get('diary')


let data = JSON.parse(localStorage.getItem(dname))

let cover_page = true, year = data.year

let dobj = null

let menupage = null

let widgets =
{
    'ipf': '<div class="widget" data-url="" onclick="show_pdf(this.id,this.dataset.url)" id="wid-pdf-uid"><i class="fi fi-ss-file-pdf"></i></div>',
    'ipi': '<div data-url="" id="wid-img-uid" onclick="show_img(this.id,this.dataset.url)"  class="widget"><i class="fi fi-br-picture"></i></div>',
    "tl": `<div id="TDL-uid" class="TODOL">
<div class="TDL_H">
    <p title="Heading" contenteditable="true">To-Do List</p>
    <button onclick="add_TDL('TDL-uid')" contenteditable="false">+</button>
</div>
<div class="TDL"><input  type="checkbox" onclick="set_ich(this,this.checked)"><p>To Do</p></div>
</div>`,

    "sl": `<div class="TODOL">
<div class="TDL_H">
    <p title="Heading" contenteditable="true">List</p>
</div>
<ul style="margin-left: 20px;" id="SDL-uid"><li><p>To Do</p></li></ul>

</div>`,
    'tbl': ` <div class="WTB">
    <table id="WTB-uid">
        <tr>
            <td>Col</td>
        </tr>
    </table>
<button title="Add Column" class="WTB-btar" onclick="add_WTBC('WTB-uid')"
    contenteditable="false">+</button>
<button title="Add Row" onclick="add_WTBR('WTB-uid')" contenteditable="false">+</button>
</div>`


}

let ldate = document.getElementById("ldate"),
    lmy = document.getElementById("lmy"),
    ld = document.getElementById("ld"),
    rdate = document.getElementById("rdate"),
    rmy = document.getElementById("rmy"),
    rd = document.getElementById("rd"),
    dpl = document.getElementById("dlp"),
    dpr = document.getElementById("drp"),
    evr =document.getElementById("evr"),
    evl =document.getElementById("evl")

let months = ["January", "February", "March", "April", "May", "June", "Jully", "August", "September", "October", "November", "December"],
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function load_diary() {
    document.getElementById("dnh").innerText = dname
    document.getElementById("dny").innerText = year

    document.getElementById("cpion").value = data.ownerName
    document.getElementById("cpidob").value = data.ownerDOB

    dobj = new Date(year)

    let lo = data.leftOf
    if (lo != null) {
        document.getElementById("dev_cn").innerHTML = ''
        let ev = data.events
        if (ev == null) {
            data.events = []
            ev = data.events
        }
        for (const [k, v] of Object.entries(ev)) {
            document.getElementById("dev_cn").insertAdjacentHTML("beforeend", `
            <div class="page-fields" id="cpev-`+ k + `">
            <p oninput='set_evdat(`+ k + `,0,this.innerText)' contenteditable="true">` + v[0] + `</p>
            <input oninput='set_evdat(`+ k + `,1,this.value)' value='` + v[1] + `' type="date" >
            <button onclick="del_ev(`+ k + `)">Delete</button>
            </div>
        `)
        }
        if (lo.type == "cp") {
            document.getElementById("divMP").style.display = ""

        } else if (lo.type == "dp") {
            cover_page = false
            document.getElementById("divMP").style.display = "none"
            document.getElementById("divDP").style.display = ""
            document.getElementById("nprbtn").style.opacity = ""
            document.getElementById("nprbtn").style.pointerEvents = ""
            dobj.setMonth(lo.pagem)
            dobj.setUTCDate(lo.page)
            display_page()
            document.getElementById("divDP").style.display = ""

        }
    } else {
        document.getElementById("divMP").style.display = ""
        data.leftOf = { type: "cp" }
    }
}

function update_cval(key, val) {
    data[key] = val
    localStorage.setItem(dname, JSON.stringify(data))
}

function next_page() {
    if (cover_page) {
        document.getElementById("divMP").style.display = "none"
        document.getElementById("divDP").style.display = ""
        document.getElementById("nprbtn").style.opacity = ""
        document.getElementById("nprbtn").style.pointerEvents = ""
        cover_page = false
        let d = dobj.getUTCDate()
        data.leftOf.type = "dp"
        data.leftOf.page = d
        display_page()

    } else {

        let dpl = document.getElementById("dlp").innerHTML,
            dpr = document.getElementById("drp").innerHTML
        if (dpl != "") {
            set_lpage(dpl)
        }
        if (dpr != '') {
            set_rpage(dpr)
        }

        let d = dobj.getUTCDate() + 2
        dobj.setUTCDate(d)
        display_page()
    }
}

function prev_page() {
    let d = dobj.getUTCDate(), rm = dobj.getMonth(), td = new Date(year)
    td.setMonth(rm)
    td.setUTCDate(d)
    let nd = d - 2
    td.setDate(nd)
    if (td.getFullYear() != year) {
        cover_page = true
        data.leftOf.type = 'cp'
        document.getElementById("nprbtn").style.opacity = "0"
        document.getElementById("nprbtn").style.pointerEvents = "none"
        document.getElementById("divMP").style.display = ""
        document.getElementById("divDP").style.display = "none"
    } else {
        let dpl = document.getElementById("dlp").innerHTML,
            dpr = document.getElementById("drp").innerHTML
        if (dpl != "") {
            set_lpage(dpl)
        }
        if (dpr != '') {
            set_rpage(dpr)
        }
        d -= 2
        dobj.setUTCDate(d)
        display_page()
    }
}

function display_page() {
    let d = dobj.getUTCDate(), rm = dobj.getMonth()
    let nd = d + 1, td = new Date(year)
    td.setMonth(rm)
    td.setUTCDate(nd)
    if (td.getUTCDate() == 1) {
        nd = 1
        rm += 1
    }
    if (d < 10) {
        d = "0" + d
    }
    ldate.innerText = d
    if (nd < 10) {
        nd = "0" + nd
    }
    rdate.innerText = nd
    let lm = dobj.getMonth()
    rmy.innerText = months[rm] + ", " + year
    lmy.innerText = months[lm] + ", " + year

    let ldd = dobj.getDay(), rdd = (ldd + 1)
    if (rdd > 6) {
        rdd = 1
    }
    ld.innerText = days[ldd]
    rd.innerText = days[rdd]

    data.leftOf.page = d
    data.leftOf.pagem = lm

    if(data.events!=null){
        let evsl ='',evsr ='',ev = data.events
        for(const [k,v] of Object.entries(ev)){
            let edate = new Date(v[1])
            let ed = edate.getUTCDate(),em = edate.getMonth()
            let ted = parseInt(d),tem = parseInt(lm)
            if(ed == ted && em == tem){
                evsl +=v[0]+"  "
                
            }

            ted = parseInt(nd),tem = parseInt(rm)
            if(ed == ted && em == tem){
                evsr +=v[0]+"  "
                
            }

        }
        if(evsl==''){
            evsl ='No Events'
        }
        
        if(evsr==''){
            evsr ='No Events'
        }

        evl.innerHTML="Events: "+ evsl
        evr.innerHTML="Events: "+ evsr
    }


    if (data.pages != null) {

        let pd = dobj.getUTCDate()

        let pld = data.pages[lm + "-" + pd.toString()], prd = data.pages[rm + "-" + (pd + 1).toString()]
        if (pld != null) {
            dpl.innerHTML = pld
        } else {
            dpl.innerHTML = ""

        }
        if (prd != null) {
            dpr.innerHTML = prd
        } else {
            dpr.innerHTML = ""

        }
    }
}

function set_lpage(val) {
    let pid = dobj.getMonth().toString() + "-" + dobj.getUTCDate().toString()
    if (data.pages == null) {
        data.pages = {}
    }
    data.pages[pid] = val
}
function set_rpage(val) {
    let pid = dobj.getMonth().toString() + "-" + (dobj.getUTCDate() + 1).toString()
    if (data.pages == null) {
        data.pages = {}
    }
    data.pages[pid] = val
}

function save() {
    localStorage.setItem(dname, JSON.stringify(data))
}

function auto_save() {
    setTimeout(() => { save(); auto_save() }, 5000)
}


function set_ich(inp, chk) {
    let ot = inp.outerHTML

    if (chk) {

        ot = ot.replace("<input ", "<input checked ")
    } else {
        ot = ot.replace('<input checked="" ', '<input ')
        console.log(ot)
    }

    inp.outerHTML = ot


}

function insert_item(it) {
    let dit = widgets[it]
    let uid = "-" + uniqueId()
    dit = dit.replaceAll("-uid", uid)
    menupage.insertAdjacentHTML('beforeend', dit + "<p style='width:100%; padding-top:5px;' contenteditable></p>")

}

function add_TDL(id) {
    document.getElementById(id).insertAdjacentHTML('beforeend', '<div class="TDL"><input  type="checkbox" onclick="set_ich(this,this.checked)"><p>To Do</p></div>    ')
}

function add_SDL(id) {
    document.getElementById(id).insertAdjacentHTML('beforeend', '<li><p>To Do</p></li>    ')
}

function show_img(wid, url) {
    let pv = document.getElementsByTagName("pre-view")[0]
    pv.style.display = "none";
    pv.style.top = mouseY(event) + 'px';
    pv.style.left = mouseX(event) + 'px';
    pv.style.display = ''
    pv.children[0].value = url
    pv.children[0].dataset.widget = wid
    pv.children[1].src = url
}


function show_pdf(wid, url) {
    let pv = document.getElementsByTagName("pre-view")[1]
    pv.style.display = "none";
    pv.style.top = mouseY(event) + 'px';
    pv.style.left = mouseX(event) + 'px';
    pv.style.display = ''
    pv.children[0].value = url
    pv.children[0].dataset.widget = wid
    pv.children[1].src = url
}

function set_dataurl(wid, val) {
    document.getElementById(wid).dataset.url = val
    document.getElementById('pimg').src = val
}
function set_pdataurl(wid, val) {
    document.getElementById(wid).dataset.url = val
    document.getElementById('pdf').src = val
}

function add_WTBR(id) {
    let tb = document.getElementById(id), rc = tb.children[0].children[0].children.length
    console.log(tb.children[0].children)
    let htr = ''
    for (var i = 0; i < rc; i++) {
        htr += '<td>Col</td>'
    }
    tb.children[0].insertAdjacentHTML("beforeend", '<tr>' + htr + '</tr>')
}

function add_WTBC(id) {
    let tb = document.getElementById(id), ch = tb.children[0].children
    for (const [k, v] of Object.entries(ch)) {
        console.log(v)
        v.insertAdjacentHTML('beforeend', '<td>Col</td>')

    }
}

function tg_gtp() {
    document.getElementsByTagName("pop-up")[0].classList.toggle("shpp")

}

function gtp_pp() {
    let d = document.getElementById("ppind").value, m = document.getElementById("ppinm").value
    if (d != '' && m != '') {
        if (cover_page) {

            next_page()
        }
        d = parseInt(d)
        m = parseInt(m)
        let doy = DayOfYear(d, m)
        if (doy % 2 == 0) {
            d -= 1
            dobj.setMonth(m)
            dobj.setUTCDate(d)
            display_page()
        } else {
            dobj.setMonth(m)
            dobj.setUTCDate(d)
            display_page()
        }
    }
    tg_gtp()

}

function gtp_cp() {
    let d = document.getElementById("cpind").value, m = document.getElementById("cpinm").value
    if (d != '' && m != '') {
        next_page()
        d = parseInt(d)
        m = parseInt(m)
        let doy = DayOfYear(d, m)
        if (doy % 2 == 0) {
            d -= 1
            dobj.setMonth(m)
            dobj.setUTCDate(d)
            display_page()
        } else {
            dobj.setMonth(m)
            dobj.setUTCDate(d)
            display_page()
        }
    }

}

function gt_cp() {
    dobj.setMonth(0)
    dobj.setUTCDate(1)
    cover_page = true
    data.leftOf.type = 'cp'
    document.getElementById("nprbtn").style.opacity = "0"
    document.getElementById("nprbtn").style.pointerEvents = "none"
    document.getElementById("divMP").style.display = ""
    document.getElementById("divDP").style.display = "none"
}

function add_ev() {
    let ev = data.events
    if (ev == null) {
        data.events = []
        ev = data.events
    }
    data.events.push(['Event', ''])
    let idl = data.length - 1
    document.getElementById("dev_cn").insertAdjacentHTML("beforeend", `
        <div class="page-fields" id="cpev-`+ idl + `">
            <p oninput='set_evdat(`+ idl + `,0,this.innerText)' contenteditable="true">Event</p>
            <input oninput='set_evdat(`+ idl + `,1,this.value)' type="date" >
            <button onclick="del_ev(`+ idl + `)">Delete</button>
        </div>
        `)

}

function del_ev(ind) {

    let ol = data.events, nl = []
    for (const [k, v] of Object.entries(ol)) {
        if (k != ind) {
            nl.push(v)
        }
    }
    data.events = nl
    let ev = data.events
    if (ev == null) {
        data.events = []
        ev = data.events
    }
    document.getElementById("dev_cn").innerHTML = ''
    for (const [k, v] of Object.entries(ev)) {
        document.getElementById("dev_cn").insertAdjacentHTML("beforeend", `
        <div class="page-fields" id="cpev-`+ k + `">
            <p oninput='set_evdat(`+ k + `,0,this.innerText)' contenteditable="true">Event</p>
            <input oninput='set_evdat(`+ k + `,1,this.value)' type="date" >
            <button onclick="del_ev(`+ k + `)">Delete</button>
        </div>
    `)
    }
    save()
}

function set_evdat(ind, sind, val) {
    data.events[ind][sind] = val
    save()
}

document.addEventListener("click", function (event) {
    document.getElementsByTagName("menu")[0].style.display = "none";
    if (event.target.tagName != 'PRE-VIEW' && event.target.parentElement.dataset.url == null) {
        document.getElementsByTagName("pre-view")[0].style.display = "none";
        document.getElementsByTagName("pre-view")[1].style.display = "none";
    }
})


dpl.addEventListener('contextmenu', function (e) {
    document.getElementsByTagName("menu")[0].style.display = "none";
    document.getElementsByTagName("menu")[0].style.top = mouseY(event) + 'px';
    document.getElementsByTagName("menu")[0].style.left = mouseX(event) + 'px';
    setTimeout(() => {
        document.getElementsByTagName("menu")[0].style.display = "flex";
    }, 100)
    menupage = dpl
    e.preventDefault();

}, false);

dpr.addEventListener('contextmenu', function (e) {
    document.getElementsByTagName("menu")[0].style.display = "none";
    document.getElementsByTagName("menu")[0].style.top = mouseY(event) + 'px';
    document.getElementsByTagName("menu")[0].style.left = mouseX(event) + 'px';
    setTimeout(() => {
        document.getElementsByTagName("menu")[0].style.display = "flex";
    }, 100)
    menupage = dpr
    e.preventDefault();

}, false);


function mouseX(evt) {
    if (evt.pageX) {
        return evt.pageX;
    } else if (evt.clientX) {
        return evt.clientX + (document.documentElement.scrollLeft ?
            document.documentElement.scrollLeft :
            document.body.scrollLeft);
    } else {
        return null;
    }
}

function mouseY(evt) {
    if (evt.pageY) {
        return evt.pageY;
    } else if (evt.clientY) {
        return evt.clientY + (document.documentElement.scrollTop ?
            document.documentElement.scrollTop :
            document.body.scrollTop);
    } else {
        return null;
    }
}

auto_save()

load_diary()