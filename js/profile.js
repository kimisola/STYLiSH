window.fbAsyncInit = function(){
    FB.init({
        appId      : '2158461621116969',
        cookie     : true,
        xfbml      : true,
        version    : 'v5.0'
    });

    FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
        statusChangeCallback(response);  
        console.log(response);         // Returns the login status.
    });
};



let fbAccess = "";
function statusChangeCallback(response) {
    console.log(response);
    console.log(response.authResponse.accessToken);
    fbAccess = response.authResponse.accessToken;
    localStorage.setItem("fb", fbAccess);
 
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.  
        console.log("Hi~~~~~")
        console.log('Welcome!  Fetching your information.... ');
        FB.login(function(response) {
            if (response.authResponse) {
                  console.log('Welcome!  Fetching your information.... ');
                  FB.api('/me',
                         'GET',
                         {"fields":"id,name,email,picture{url}"},  function(response) {
                    console.log('Good to see you, ' + response.name + '.');
                    console.log(response)
                    renderPage(response)     
                });
            } 
        });
    } else {         
        console.log("非登入狀態喔")
        FB.login(function(response) {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me',
                       'GET',
                       {"fields":"id,name,email,picture{url}"},  function(response) {
                    console.log('Good to see you, ' + response.name + '.');
                    location.href = "profile.html"; 
                    console.log(response)
                    renderPage(response)
                });
            } 
        },  {scope: 'email', return_scopes: true});
    }
}


function divTextFunction(Text,classN,id){
    div = document.createElement("div");
    if (Text !== undefined) { Text = document.createTextNode(Text) }
    if (classN !== undefined) { div.className = classN };
    if (id !== undefined) { div.id = id }
    div.append(Text);
    return div;
}
   
function renderPage(res) {
    const container = document.getElementsByClassName("container");
    container[0].innerHTML = "";
     
    const profileD = divTextFunction("", "", "profileD")
    const picture = divTextFunction("", "", "picture")
    const img = document.createElement("img")
    img.setAttribute('src', `http://graph.facebook.com/${res.id}/picture?type=normal`);
    picture.append(img);
   
    const name = divTextFunction(res.name, "name");
    const email = divTextFunction(res.email, "mail");
    const data = divTextFunction("", "data");
    data.append(name, email)
    profileD.append(picture, data)

    const inf1 = divTextFunction("", "information", "information1")
    const inf2 = divTextFunction("", "information", "information2")
    const inf3 = divTextFunction("", "information", "information3")

    const ball1 = divTextFunction("通知中心", "ball", "ball1")
    const ball2 = divTextFunction("訂單查詢", "ball", "ball2")
    const ball3 = divTextFunction("累積點數", "ball", "ball3")

    const con1 = divTextFunction("聖誕節促銷活動開跑～～", "content", "content1")
    const con2 = divTextFunction("尚未有交易資料", "content", "content2")
    const con3 = divTextFunction("現在還沒有點數哦！", "content", "content3")

    inf1.append(ball1, con1)
    inf2.append(ball2, con2)
    inf3.append(ball3, con3)
    container[0].append(profileD, inf1, inf2, inf3);
    ball();
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

let cartAr = []; 
window.addEventListener("load", function() {
    searchProduct();

	if ( localStorage.length !== 0 ) {
	let localData = localStorage.getItem("cart");
    ld = JSON.parse(localData);  //string轉乘json檔
    console.log(ld)
		for (i in ld) {
			cartAr.push(ld[i]);  //逐一push進去
		}
	addQty();
	}
});

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


//圈圈
function ball() {
    for (let i = 0; i < 3; i++ ) {  //var是單一數 這裡用了會失敗 let可以每一次都有新的變數
    let balls = document.getElementsByClassName("ball")
    let contents = document.getElementsByClassName("content")
    balls[i].addEventListener("mouseover", () => {
        contents[i].style.display = "block";
        });
    }
}