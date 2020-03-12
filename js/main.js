let page = "";
let searchValue = "";
let category = "all";
let baseURL = "https://api.appworks-school.tw/api/1.0/products/";

//捲軸瀏覽至底載入另一頁面
window.onscroll = function(){
    var scrollT = document.documentElement.scrollTop; //html頂部與可視範圍視窗頂部的距離(也就是滑過多少的高度)
    var scrollH = document.documentElement.scrollHeight; //html高度
    var clientH = document.documentElement.clientHeight; //當前可視範圍(viewport) 基本上不變更視窗為固定值
    if(scrollT + clientH >= scrollH){
        loadPage(page); 
    }
};

getURLdetaiil();
function getURLdetaiil() {
    var url = location.href;
    var index = url.split("index.html");  //或?後面沒有值則傳到首頁
    console.log(index[0])
    console.log(index[1])
    if ( index[1] ) {  //表示「不是空值不是null不是undefinded」就為true
        var cateTemp = url.split("?"); 
        var cate = cateTemp[1].split("=");

        if ( cate[0] == "category" ) {
            if ( cate[1] == "all" ) { allproduct(); console.log('Go To all') } 
			else if (cate[1] == "women") { women(); console.log('Go To women') } 
			else if (cate[1] == "men") { men(); console.log('Go To men') } 
            else if (cate[1] == "accessories") { accessories(); console.log('Go To accessories') }         
        } else if (cate[0] == "search") {
            searchProduct();
        }
    } else {
        ajax("https://api.appworks-school.tw/api/1.0/products/all?paging=0");
    }
}

function allproduct() { category = "all"; Clearfn() };
function women() { category = "women"; Clearfn() };  
function men() { category = "men"; Clearfn() };
function accessories() { category = "accessories"; Clearfn() };
       
function Clearfn () {  //需清空的東西寫一起
     document.getElementById("searchblock").value = "";
     document.getElementById("mobileSearchBlock").value = "";
     searchValue = "";
     page = "";
     clickPage(); 
    };

function clickPage() {
    document.getElementById("items").innerHTML = "";  //清空
    page = null;   //reset page
    ajax("https://api.appworks-school.tw/api/1.0/products/"+ category + "?paging=" + page);
    console.log(page);
    }

function loadPage() {   
    if (page == undefined) {
        console.log("No more page!")
    } else {
        if ( searchValue !== "") {
            ajax( baseURL + "search?keyword=" + searchValue + "&paging=" + page);      
            console.log(searchValue)    
        } else {
            ajax( baseURL + category + "?paging=" + page);
        }
    }  
};

function ajax(src){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let response = JSON.parse(xhr.responseText).data;   //把JSON資料變成object
                page = JSON.parse(xhr.responseText).next_paging;  //取用裡面data和next paging
                    
                if (response.length == 0) {
                    document.getElementById("items").innerHTML =
                    `<div class="row">
                    <h3>Oops! Something went wrong and we couldn't process your request.</h3>
                    </div>`
                console.log('無法取得資料')
                } else {
                    render(response);
                }
            }
        };
    xhr.open('GET', src);
    xhr.send();
};
   
function render(response) {  //渲染 要做template再render  element為for each選到的項目  第三行>傳網址到peoduct page
    Object.values(response).forEach(element => {
           const template =   //大迴圈跑一次
           `<div class="row" onclick="location.href='product.html?${element.id}';">
            <div class="productImg"><img src=${element.main_image} class="item" ></div>
               <div class="color" id ="${element.id}"></div>
       
               <div class="productdetail"></div>
                   <p class="productname" >${element.title}</p>
                   <p class="productprice" >TWD. ${element.price}</p>
           </div>`
   
            document.getElementById("items").innerHTML += template;   //.appendChild += template???
   
       for(var i in element.colors){   //在每個id下 loop有幾個color
           var textnode = '<div class="productcolor" style="background-color:#' + element.colors[i].code +'"></div>';
           document.getElementById(element.id).innerHTML += textnode; 
        }
    });
};

//search function  A 和B都會指向執行滾動滾輪的fun
//把不同網址結合寫在一起
function searchProduct(e) {
	console.log(e)
	
	var url = location.href;
	var search = url.split("?search=");  //或?後面沒有值則傳到首頁
	var tk = search[1];
    document.getElementById("items").innerHTML = "";
    searchValue = tk;
	console.log(search)
    page = null;

    if ( searchValue !== "" ) {
        ajax( baseURL + "search?keyword=" + searchValue + "&paging=" + page);
        console.log( baseURL + "search?keyword=" + searchValue + "&paging=" + page)
    } else {
        ajax( baseURL + category + "?paging=" + page);
    }
}

//監聽事件
function searchProductFromUrl() {
    const search = document.getElementById("searchblock");
    const searchM = document.getElementById("mobileSearchBlock");
    console.log(search.value)
    search.addEventListener("change", () => {
        window.history.pushState(" ","uselessTitle", "?search=" + search.value);
        searchProduct();
    });

    searchM.addEventListener("change", () => {
        window.history.pushState(" ","uselessTitle", "?search=" + searchM.value);
        searchProduct();
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
        document.getElementById("items").innerHTML = ""; 
        location.href = "index.html";
    });
    mainlogo.addEventListener("click", () => {
        document.getElementById("items").innerHTML = ""; 
        location.href = "index.html";
    });
}

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

//Render Marketing Campaigns
campaigns("https://api.appworks-school.tw/api/1.0/marketing/campaigns");

function campaigns(src){
       var xhr = new XMLHttpRequest();
       xhr.onreadystatechange = function() {
           if (xhr.readyState == 4 && xhr.status == 200) {
               let response = JSON.parse(xhr.responseText).data;   //把JSON資料變成object
            camRender(response);
           }
       };
       xhr.open('GET', src);
       xhr.send();
    };
   

function camRender(response) {
        
    Object.values(response).forEach(element => {
        let campaigns = document.getElementById("campaigns");
        let mySlides = document.createElement("div");
        
        mySlides.className = "mySlides";
        

        mySlides.setAttribute('onclick', `location.href="https://api.appworks-school.tw/product.html?id=${element.product_id}"`);
        mySlides.setAttribute('style', `background-image: url("https://api.appworks-school.tw/${element.picture}")`);
        
        let story = document.createElement("div");
        let stringText = String(element.story); 
        let storyText = stringText.split("\r\n");  //切割  

        story.className = "story";
        for ( i = 0; i < storyText.length; i++ ) {
            let br = document.createElement("br");
            story.append(storyText[i], br);
        }
        
        mySlides.appendChild(story);
        campaigns.appendChild(mySlides);

        let dots = document.getElementById("dots")
        //  dot.setAttribute('onclick', `location.href="https://api.appworks-school.tw/product.html?id=${element.product_id}"`);
        
        let dot = document.createElement("span");
        dot.className = "dot";
        dot.setAttribute('onclick', `currentSlide(${slideIndex++})`);  //預設點傳入dot會傳入的參數
        dots.append(dot); 
    });
   showSlides(slideIndex);
};


//Slideshow
let slideIndex = 1;  //全域

function currentSlide(n) {
    console.log(n);
	var highestTimeoutId = setTimeout(";");  //點擊dot會取消 setTimeout
		for (var i = 0 ; i < highestTimeoutId ; i++) {
			clearTimeout(i); 
		}
    slideIndex = n;  //把全域變數的值變成n
    showSlides();
}

function showSlides(n) {

    let slides = document.getElementsByClassName("mySlides"); //所有圖片
    let dot = document.getElementsByClassName("dot");
    
    if ( slideIndex > slides.length ) {
        slideIndex = 1;
    }
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for ( i = 0; i < dot.length; i++ ) {
        dot[i].classList.remove("active")
    }

    slides[slideIndex-1].style.display = "block";
    dot[slideIndex-1].className += " active";  //不覆蓋現有class
    setTimeout(showSlides, 3000); 
    slideIndex++;
}

//每當畫面load近來要去確認localStorage裡面有沒有東西
let cartAr = [];    //全域變數 創一個空陣列

window.onload = function() {
    searchProductFromUrl();
    magnifier();
    transToHome();

	if ( localStorage.length !== 0 ) {
	let localData = localStorage.getItem("cart");
    ld = JSON.parse(localData);  //string轉乘json檔
    console.log(ld)
		for (i in ld) {
			cartAr.push(ld[i]);  //逐一push進去
		}
	addQty();
	}
};

function addQty() {
    const cartQty = document.getElementsByClassName("cartItem");
    for ( i = 0; i < cartQty.length; i++ ) {
    console.log(cartQty[i]);
    cartQty[i].innerHTML = "";
    let cartQtyText = document.createTextNode(cartAr.length);  //創好的陣列長度
    cartQty[i].appendChild(cartQtyText)
    console.log(cartAr.length)
    }
}

