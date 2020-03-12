let urlId = "";
let pudQuantity ;
let stockValue = "";
let colorValue = "";
let sizeValue = "";
let response ;
let page = "";
let searchValue = "";
let category = "all";
let baseURL = "https://api.appworks-school.tw/api/1.0/products/";

getId();
function getId() {
    var url = location.href;
    var urlTemp = url.split("?");
    urlId = urlTemp[1];
    console.log(urlId)
}

productDetail("https://api.appworks-school.tw/api/1.0/products/details?id=" + urlId)

function productDetail(src){
    console.log(src)
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(JSON.parse(xhr.responseText));
                response = JSON.parse(xhr.responseText).data;
                    
                console.log(response)
                getDetail(response);
                                
            }
        };
        xhr.open('GET', src);
        xhr.send();
};
   
function getDetail(response) {  

        let containerTop = document.getElementById("containerTop");
        let br = document.createElement("br");
        let main_image = document.createElement("img");
        main_image.className = "main_image";
        main_image.setAttribute('src', `${response.main_image}`);

        let product = document.getElementById("product");
        let title = document.createElement("h3");
        title.className = "title";
        let titleText = document.createTextNode(response.title);
        title.appendChild(titleText);
        let id = document.createElement("p");
        id.className = "id";
        let idText = document.createTextNode(response.id);
        id.appendChild(idText);
        let price = document.createElement("div");
        price.className = "price";
        let priceText = document.createTextNode("TWD." + response.price);
        price.appendChild(priceText);

        for(var i in response.colors) {
            let colorDiv = document.getElementById("colorDiv");
            let colorBox = document.createElement("div");
            colorBox.className = "color-box";
            let color_code = document.createElement("div");
            color_code.className = "color-code";
            color_code.setAttribute('style', `background-color: #${response.colors[i].code};)`);
            color_code.setAttribute('onclick', `selectColor(${i}, '${response.colors[i].code}');CheckValue();`);
            colorBox.append(color_code);        //↑這裡的i是function裡面的陣列標籤[i = 0]可以叫到第一個 再下面需要用到
            colorDiv.append(colorBox)
        }
        product.prepend(title, id, price, colorDiv);
        containerTop.append(main_image, product);

        for(var i in response.sizes) {
            let sizes = document.getElementById("sizes");
            let size = document.createElement("div");
            size.className = "size";
            let sizeText = document.createTextNode(response.sizes[i]);
            size.setAttribute('onclick', `selectSize(${i},"${response.sizes[i]}");CheckValue();`);
            size.appendChild(sizeText);
            sizes.append(size)
        }

        let quantity = document.getElementById("quantity");
        let quantityNum = document.getElementById("quantityNum");
        let quantityNumDe = document.createElement("div");
        let quantityNumEl = document.createElement("div");
        let quantityNumIn = document.createElement("div");
        quantityNumDe.className = "quantityNumDe"; 
        quantityNumDe.setAttribute('onclick', 'countNum(-1)');
        quantityNumEl.setAttribute('id', 'quantityNumEl');
        quantityNumEl.className = "quantityNumEl"; 
        quantityNumIn.className = "quantityNumIn";
        quantityNumIn.setAttribute('onclick', 'countNum(1)');
        let quantityNumDeText = document.createTextNode("－");
        let quantityNumElText = document.createTextNode(1);
        let quantityNumInText = document.createTextNode("＋");
        quantityNumDe.appendChild(quantityNumDeText);
        quantityNumEl.appendChild(quantityNumElText);
        quantityNumIn.appendChild(quantityNumInText);
        quantityNum.append(quantityNumDe, quantityNumEl, quantityNumIn);
        quantity.appendChild(quantityNum)


        let note = document.createElement("div");
        note.className = "note";
        let noteText = document.createTextNode(response.note);
        note.appendChild(noteText);

        let texture = document.createElement("div");
        texture.className = "texture";
        let textureText = document.createTextNode(response.texture);
        texture.appendChild(textureText);

        let description = document.createElement("div");
        description.className = "description";
        let descriptionStriText = String(response.description);
        let descriptionText = descriptionStriText.split("\r\n");

        for ( i = 0; i < descriptionText.length; i++ ) {
            let br = document.createElement("br");
            description.append(descriptionText[i], br);
        }

        let wash = document.createElement("div");
        wash.className = "wash";
        let washText = document.createTextNode("清洗：" + response.wash);
        wash.appendChild(washText);

        let place = document.createElement("div");
        place.className = "place";
        let placeText = document.createTextNode("產地：" + response.place);
        place.appendChild(placeText);

        product.prepend(title, id, price, colorDiv, sizes, quantity);
        product.append(note, texture, description, br, wash, place);


        let product_details = document.getElementById("product_details");
        let product_story = document.createElement("div");
        product_story.className = "story";
        let storyText = document.createTextNode(response.story);
        product_story.appendChild(storyText);
        product_details.append(product_story);

        for(var i in response.images) {
            let product_images = document.createElement("img");
            product_images.className = "product_images";
            product_images.setAttribute('src', `${response.images[i]}`); 
            product_details.append(product_images);
        }
        containerTop.append(main_image, product);
        startCheck();
};


function countNum(e) {  //計算數字可以按到多少
	const qNE = document.getElementById("quantityNumEl");
	if( e > 0 && pudQuantity < stockValue) {
			pudQuantity += e;
			qNE.innerHTML = "";
			let quantityNumElText = document.createTextNode(pudQuantity);
			qNE.appendChild(quantityNumElText);
	} else if ( e < 0 && pudQuantity > 1 ) {
			pudQuantity += e;
			qNE.innerHTML = "";
			let quantityNumElText = document.createTextNode(pudQuantity);
			qNE.appendChild(quantityNumElText);		
    }
}
    
function CheckValue() {  //確認user點了哪個顏色哪個尺寸跟資料庫核對後再確認該對應的庫存
    checkSize();
    const qNE = document.getElementById("quantityNumEl");
    qNE.innerHTML = "";
    pudQuantity = 1;
    let quantityNumElText = document.createTextNode(pudQuantity);
	qNE.appendChild(quantityNumElText);
    if ( sizeValue !== "" && colorValue !== "" ) {
        console.log("go stockCheck!")
        stockCheck();
    }
}

function checkSize() {   //確認該顏色下的size是否都有庫存、若為0則反灰無法點擊
	let sizeBox =document.getElementsByClassName("size");
	//清除現有的所有 nameclass colorChange
		for ( i = 0; i < sizeBox.length; i++ ) {
			sizeBox[i].classList.remove("colorChange")
		}
	var res  = response;
    for ( var i in res.variants ) {
	if(res.variants[i].color_code == colorValue ) {
		console.log(res.variants[i].stock);
		if( res.variants[i].stock == 0) {
			var x = i%res.sizes.length  //取餘數
			console.log('第' + x + '個沒有庫存')
				sizeBox[x].classList.remove("selectt")
				sizeBox[x].className += " colorChange";
			console.log(sizeBox[x])
		    }
		}
	}
}

function stockCheck() {
    const addToCart = document.getElementsByClassName("addToCart");
    addToCart[0].innerHTML = ""; //ClassName addToCart陣列中的第一個
    let sText = document.createTextNode("加 入 購 物 車");  //創好的陣列長度
    addToCart[0].appendChild(sText)
   
    var res  = response;
    console.log(res)
    for ( var i in res.variants ) {
        if ( res.variants[i].color_code == colorValue && res.variants[i].size == sizeValue ) {
            stockValue = res.variants[i].stock;
            if ( localStorage.length !== 0 ) {
                let localData = localStorage.getItem("cart");
                ld = JSON.parse(localData);  //string轉乘json檔
                console.log(ld)
                for ( l in ld ) {  //表示又買了原本購物車裡面有的商品、所以要扣掉庫存量
                    if ( ld[l].color[0].code == colorValue && ld[l].size == sizeValue ) {
                        stockValue -= ld[l].qty;
                    }
                }
                if ( stockValue == 0 ) {
                    
                    addToCart[0].innerHTML = ""
                    let sText = document.createTextNode('已完售');  //創好的陣列長度
                    addToCart[0].appendChild(sText)
                }
            }
            console.log(stockValue);
           }
       }
   }

function selectColor(c, d) { 
    let colorBox = document.getElementsByClassName("color-box");
    for ( i = 0; i < colorBox.length; i++ ) {
        colorBox[i].classList.remove("selectt")
    }
    colorBox[c].className += " selectt";
    colorValue = d;
    console.log(colorValue)
}

function selectSize(c, d) {
    let sizeBox = document.getElementsByClassName("size");
    for ( i = 0; i < sizeBox.length; i++ ) {
        sizeBox[i].classList.remove("selectt")
    }
    sizeBox[c].className += " selectt";
    sizeValue = d;
    console.log(sizeValue)
}

function startCheck() {  //預設初始值選取第一個項目
	var res  = response;
	selectColor(0, res.colors[0].code);
	selectSize(0, res.sizes[0]);
	CheckValue();
};

console.log(localStorage)

//每當畫面load近來要去確認localStorage裡面有沒有東西、購物車有幾項顯示在icon
let cartAr = [];    //全域變數 創一個空陣列

window.addEventListener("load", function(){
    searchProduct();
    magnifier();
    cartItems();
    aTc();
    transToHome();

	if ( localStorage.length !== 0 ) {
	let localData = localStorage.getItem("cart");
    ld = JSON.parse(localData);  //string轉成json檔
    console.log(ld)
		for (i in ld) {
			cartAr.push(ld[i]);  //逐一push進去
		}
	addQty();
	}
})
// window.onload = function() {
//     searchProduct();
//     magnifier();
//     cartItems();
//     aTc();
//     transToHome();

// 	if ( localStorage.length !== 0 ) {
// 	let localData = localStorage.getItem("cart");
//     ld = JSON.parse(localData);  //string轉成json檔
//     console.log(ld)
// 		for (i in ld) {
// 			cartAr.push(ld[i]);  //逐一push進去
// 		}
// 	addQty();
// 	}
// };

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

function addToCart() {
    var res  = response;
    console.log(typeof(localStorage))
    console.log(localStorage)

    for ( var i in res.variants ) {
        if ( res.variants[i].color_code == colorValue && res.variants[i].size == sizeValue ) {
            if ( stockValue !== 0 ) {  
                    for ( c in res.colors ) {  //get color name
                        if( colorValue == res.colors[c].code ) {
                        console.log(res.colors[c].name)

                        var productAddToCart = {  //已經是json檔形式
                            "id": urlId,
                            "name": res.title,
                            "price": res.price,
                            "color": [{
                                "code": colorValue,
                                "name": res.colors[c].name,
                            }],
                            "size": sizeValue,
                            "qty": pudQuantity
                        }
                        }
                    }
                  if ( cartAr.length !== 0) {
                     for ( i in cartAr )  { 
                        if ( cartAr[i].id == urlId && cartAr[i].color[0].code == colorValue && cartAr[i].size == sizeValue ) {
                            cartAr.splice(i, 1)  //(刪除重複的對象訂單,刪除一個東西)、下面加入新的
                            } 
                        }  
                    } 
                cartAr.push(productAddToCart);
                console.log(cartAr);
                cart = JSON.stringify(cartAr);
                localStorage.setItem("cart", cart);
                addQty();
                stockCheck();
                alert("已加入購物車！");
            }
        }
    }
    const qNE = document.getElementById("quantityNumEl");  //reset加入購物車後的數量顯示1
    qNE.innerHTML = "";
    pudQuantity = 1;
    let quantityNumElText = document.createTextNode(pudQuantity);
	qNE.appendChild(quantityNumElText);
}

//監聽事件
function cartItems() {
    const cartItem_mobile = document.getElementById("cartItem-mobile")
    cartItem_mobile.addEventListener("click", () => {
        location.href='cart.html';
    });

    const carticon = document.getElementById("carticon")
    carticon.addEventListener("click", () => {
        location.href='cart.html';
    });
}

function aTc() {
    document.getElementsByClassName("addToCart")[0].addEventListener("click", () => {
        addToCart();
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

//mobile點出現搜尋框 使logo消失 放大鏡連結搜尋fun
var isShow = false;
function mobileSearch() {
    var el = document.getElementById("mobileSearchBlock");
    var cl = document.getElementById("mainlogophone");
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