const goHome = document.getElementById("goHome")
goHome.addEventListener("click", function (event) {
    location.href='index.html';
});

num = "";
getOrderNum();
function getOrderNum() {
    var url = location.href;
    var urlTemp = url.split("?");
    num = urlTemp[1];
    console.log(num)
}

const orderN = document.getElementsByClassName("orderNum");
let numText = document.createTextNode(num);
orderN[0].append(numText);

//mobile點出現搜尋框 使logo消失 放大鏡連結搜尋fun
var isShow = false;
function mobileSearch() {
    var el = document.getElementById('mobileSearchBlock');
    var cl = document.getElementById('mainlogophone');
    if(!isShow) {
      isShow = true;
      el.style.display="";
      cl.style.display="none";
    }
    else {
      searchProduct();
      isShow = false;
      el.style.display="none";
      cl.style.display="";
    }			
}

function searchProduct() {
    const search = document.getElementById("searchblock");
    const searchM = document.getElementById("mobileSearchBlock");
    console.log(search.value)
    search.addEventListener("change", () => {
        location.href="index.html?search=" + search.value;
    });

    searchM.addEventListener("change", () => {
        location.href="index.html?search=" + searchM.value;
    });
}

function magnifier() {
    const magnifier = document.getElementById("search");
    magnifier.addEventListener("click", () => {
        mobileSearch();
    });
}

function transToHome() {
    const mainlogophone = document.getElementById("mainlogophone");
    const mainlogo = document.getElementById("mainlogo");
    mainlogophone.addEventListener("click", () => {
        location.href="index.html";
    });

    mainlogo.addEventListener("click", () => {
        location.href="index.html";        
    });

}


window.onload = function() {
    searchProduct();
    magnifier();
    transToHome();
}