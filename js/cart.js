let img = "";
let idForImg = "";
const baseURL = "https://api.appworks-school.tw/api/1.0/products/details?id=";
let getPayable = 0;

var cart = localStorage.getItem("cart")
cartJson = JSON.parse(cart)
console.log(cartJson)


//渲染
printCartList();
function printCartList (response, idForImg) {
	console.log(cartJson)
	if ( cartJson == null || localStorage.cart.length == 2 ) {  //第一次到網站還沒有localStorage所以是null、但曾經購物過就會有cart
		document.getElementById("cartList").innerHTML = "";
		const notice = document.createElement("h4");
		let noticeText = document.createTextNode(" 購物車裡面沒有東西哦! 趕快去購物吧~~~");
		const cartList = document.getElementById("cartList");
		notice.append(noticeText);
		cartList.appendChild(notice);

	} else {

    for ( var i = 0; i < cartJson.length; i++ ) {
	const cartList = document.getElementById("cartList");
	const row = document.createElement("div");
	const br = document.createElement("br");
	const br1 = document.createElement("br");
	const br2 = document.createElement("br");
	row.className = "row";
	
	
	const box = document.createElement("div");
	box.className = "box";
		const box1 = document.createElement("div");
		box1.className = "box1";
		const div_img = document.createElement("div");
		div_img.className = "div_img";
		const details = document.createElement("div");
		details.className = "details";
			let nameText = document.createTextNode(cartJson[i].name);
			let idText = document.createTextNode(cartJson[i].id);
			let colorNameText = document.createTextNode("顏色：" + cartJson[i].color[0].name);
			let sizeText = document.createTextNode("尺寸：" + cartJson[i].size);
			details.append(nameText, idText, br, br1, colorNameText, br2, sizeText);

	box1.append(div_img,details);
	box.append(box1);
	
	
	const web = document.createElement("div");
	web.className = "web";
		const qty = document.createElement("div");
		qty.className = "qty";
		//預計插入迴圈做庫存數量
		
		const price = document.createElement("div");
		price.className = "price";
			let priceText = document.createTextNode("NT. " + cartJson[i].price);
			price.append(priceText);
		const subtotal = document.createElement("div");
		subtotal.className = "subtotal";

		const trashcan = document.createElement("div");
		trashcan.className = "trashcan";
		trashcan.setAttribute("onclick", `removeProduct(${i})`);
			const image = document.createElement("img");
			image.setAttribute("src", "images/cart-remove.png");
			trashcan.append(image);

	web.append(qty, price, subtotal, trashcan)
	
	let mobile = document.createElement("div");
		mobile.className = "mobile";
	
	for ( var j = 0 ; j < 3; j++ ) {  //render第2、3個mobileitem
		const mobileItem = document.createElement("div");
			mobileItem.className ="mobileItem";
			mobile.append(mobileItem);
			if ( j == 1 ) {
				const priceTag = document.createElement("div");
					priceTag.append("單價")
				const mobilePrice = document.createElement("div");
				let priceText = document.createTextNode("NT. " + cartJson[i].price);
					mobilePrice.className = "price";
					mobilePrice.append(priceText);
					mobileItem.append(priceTag, mobilePrice)
			}
			if ( j == 2 ) {
				const subtotalTag = document.createElement("div");
				subtotalTag.append("小計")
				const mobileSubtotal = document.createElement("div");
				mobileSubtotal.className = "subtotal";
				mobileItem.append(subtotalTag, mobileSubtotal)
			}
		}
    row.append(box, web , mobile)
	cartList.append(row);
    }
    getImg();
	printmobileTrashcan();
}
}


//取得商品縮圖> 一連串
function getImg() {
    for ( var i = 0; i < cartJson.length; i++ ) {
        console.log(cartJson[i].id)
        idForImg = cartJson[i].id
        let res = baseURL + idForImg;
        getApi(res, i);
	}
}
    
function getApi(res, i) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(JSON.parse(xhr.responseText));
        response = JSON.parse(xhr.responseText).data;
        
        console.log(response)
        printImgList(response,i);    
        }
    };
    xhr.open('GET', res);
    xhr.send();
}

//以下是用response data
function printImgList (response, i) {
    const div_img = document.getElementsByClassName("div_img");
    const image = document.createElement("img");
    image.setAttribute("src", `${response.main_image}`);
	div_img[i].innerHTML = "";
    div_img[i].append(image);
	
	const qtyClass = document.getElementsByClassName("qty");
	const select = document.createElement("select");
		select.setAttribute("id", "Number" + i );
		select.setAttribute("onchange", `getSubPrice(${i}); getP(); refreshLocalW(${i});`)  //參數為點擊的值、第幾個row
			for ( v in response.variants ) {
				if ( response.variants[v].color_code ==  cartJson[i].color[0].code && response.variants[v].size == cartJson[i].size ) {
					var op = response.variants[v].stock;

					for ( var x = 1 ; x <= op; x++ ) {
						const myOption = document.createElement("option");
						myOption.value = x;
						myOption.text = x;
						if ( cartJson[i].qty == x ) {  //第幾個option等於選擇的qty
							myOption.setAttribute("selected", "");
						}
						select.append(myOption);
					}
				}
			}
		qtyClass[i].innerHTML = "";
		qtyClass[i].append(select);
	
	//手機板		
	const mobileItems = document.getElementsByClassName("mobileItem");
	const nums = document.createElement("div");
	let numsText = document.createTextNode("數量");
		nums.append(numsText);
		mobileItems[i*3].innerHTML = "";
		mobileItems[i*3].append(nums)
		
	const qty = document.createElement("div");
	qty.className = "mobileQty";

	const select1 = document.createElement("select");
		select1.setAttribute("id", "mobileNumber" + i );
		select1.setAttribute("onchange", `MgetSubPrice(${i}); getP(); refreshLocalP(${i})`)
		for ( v in response.variants ) {
			if ( response.variants[v].color_code ==  cartJson[i].color[0].code && response.variants[v].size == cartJson[i].size ) {
				var op = response.variants[v].stock;
				for ( var x = 1 ; x <= op; x++ ) {
					const myOption = document.createElement("option");
					myOption.value = x;
					myOption.text = x;
					if ( cartJson[i].qty == x) {
						myOption.setAttribute("selected", "");
					}
					select1.append(myOption);
				}
			}
		}
	qty.innerHTML = "";
	qty.append(select1)
	mobileItems[i*3].append(qty)  
	getSubPrice(i);
}

function MgetSubPrice(i) {  //手機小計
	for ( var j = 0; j <= 1 ; j++ ) {
		const subtotals = document.getElementsByClassName("subtotal");
				console.log(subtotals)
		let Number = document.getElementById("mobileNumber" + i );
		console.log(subtotals[i*2+j])
		let unitPrice = cartJson[i].price;
		let unitQty = Number.value;

		subtotals[i*2+j].innerHTML = "";
		
		let subtotalText = document.createTextNode("NT. " + ( unitPrice * unitQty ));
		subtotals[i*2+j].append(subtotalText)  //偶數網頁板、奇數手機板 每個i近來跑一次j
	
	}
	if ( i == cartJson.length-1 ) {  //讓它跑到最後一個i再渲染價錢出來
		getP();
	}
}

function getSubPrice(i) {  //網頁小計
	for ( var j = 0; j <= 1 ; j++ ) {
		const subtotals = document.getElementsByClassName("subtotal");
		let Number = document.getElementById("Number" + i );
		let unitPrice = cartJson[i].price;
		let unitQty = Number.value;

		subtotals[i*2+j].innerHTML = "";
		
		let subtotalText = document.createTextNode("NT. " + ( unitPrice * unitQty ));
		subtotals[i*2+j].append(subtotalText)  //偶數網頁板、奇數手機板 每個i近來跑一次j
	}

	if ( i == cartJson.length-1 ) {
		console.log(cartJson.length)
		console.log(i)
		getP();
	}
}

function getP() {  //渲染底下總金額
getPayable = 0;
	const subtotals = document.getElementsByClassName("subtotal");
	console.log(subtotals.length)
	console.log(cartJson.length)
	for ( var s = 0 ; s < subtotals.length; s++ ) {
		console.log((subtotals[s].innerText.split("NT. ")[1]))
		getPayable += Number(subtotals[s].innerText.split("NT. ")[1]);
	 	console.log(getPayable)
	}
	const confirmPrice1 = document.getElementsByClassName("confirmPrice1");
	confirmPrice1[0].innerHTML = "";
    confirmPrice1[0].append("NT. " + ( getPayable / 2));
	console.log(getPayable/2)

	payableAmount(getPayable/2);
}

function payableAmount(t) {
	const confirmPrice3 = document.getElementsByClassName("confirmPrice3");
	confirmPrice3[0].innerHTML = "";
	confirmPrice3[0].innerHTML = "NT. " + ( t + 60 );
}
   
function printmobileTrashcan() {
	const row = document.getElementsByClassName("row")
	console.log(row.length)
	for ( var i = 0; i < row.length; i++ ) {
		const box = document.getElementsByClassName("box");  //mobileTrashcan
		const mobileTrashcan = document.createElement("div");
		mobileTrashcan.className = "mobileTrashcan";
		mobileTrashcan.setAttribute("onclick", `removeProduct(${i})`);
		const im = document.createElement("img");
		im.setAttribute("src", "images/cart-remove.png");
		mobileTrashcan.appendChild(im)
		box[i].append(mobileTrashcan);
	} 
}

function removeProduct(n) { //第n個垃圾桶被按所以刪除第n個
	alert("您確定要刪除「" + cartJson[n].name + "」嗎？")
	cartJson.splice(n, 1);
	let newLocalList = JSON.stringify(cartJson)
	console.log(cartJson)
	console.log(newLocalList)
	localStorage.setItem("cart", newLocalList);

	document.getElementById("cartList").innerHTML = "";
	printCartList();
	checkQtyIcon();

	if ( localStorage.cart.length == 2 ) {  //cart為空陣列時有兩個字元[ ]
		console.log(localStorage.cart.length)
		console.log(localStorage.cart)
		document.getElementById("cartList").innerHTML = "";
		const notice = document.createElement("h4");
		let noticeText = document.createTextNode(" 購物車裡面沒有東西哦! 趕快去購物吧~~~");
		const cartList = document.getElementById("cartList");
		notice.append(noticeText);
		cartList.appendChild(notice);
	}
}

//每當畫面load近來要去確認localStorage裡面有沒有東西、購物車有幾項顯示在icon
let cartAr = [];    //全域變數 創一個空陣列

window.onload = function () {
	searchProduct();
	onSubmit();
	transToHome();

	if ( localStorage.length !== 0 ) {
	let localData = localStorage.getItem("cart");
    ld = JSON.parse(localData);  //string轉成json檔
    console.log(ld)
		for (i in ld) {
			cartAr.push(ld[i]);  //逐一push進去
		}
	}
	addQty();
};

function checkQtyIcon() {
	cartAr = [];
	if ( localStorage.length !== 0 ) {
	let localData = localStorage.getItem("cart");
    ld = JSON.parse(localData);  //string轉成json檔
    console.log(ld)
		for (i in ld) {
			cartAr.push(ld[i]);  //逐一push進去
		}
	}
	addQty();
};

function addQty() {
    const cartQty = document.getElementsByClassName("cartItem");
    for ( i = 0; i < cartQty.length; i++ ) {
    cartQty[i].innerHTML = "";
    let cartQtyText = document.createTextNode(cartAr.length);  //創好的陣列長度
    cartQty[i].appendChild(cartQtyText)
    }
}

function refreshLocalW(i) {  //儲存數量更-網頁版
	let old = cartJson[i];
	const theRow = document.getElementById("Number" + i);

	var newRow = {
		"id": old.id,
		"name": old.name,
		"price": old.price,
		"color": [{
			"code": old.color[0].code,
			"name": old.color[0].name,
		}],
		"size": old.size,
		"qty": theRow.value
	}

	let oldLocal = localStorage.getItem("cart");
	renewLocalJson = JSON.parse(oldLocal);
	renewLocalJson.splice(i, 1, newRow);

	cart = JSON.stringify(renewLocalJson);
	localStorage.setItem("cart", cart);
}

function refreshLocalP(i) {  //儲存數量更-手機版
	let old = cartJson[i];
	const theRowP = document.getElementById("mobileNumber" + i);

	var newRow = {
		"id": old.id,
		"name": old.name,
		"price": old.price,
		"color": [{
			"code": old.color[0].code,
			"name": old.color[0].name,
		}],
		"size": old.size,
		"qty": theRowP.value
	}

	let oldLocal = localStorage.getItem("cart");
	renewLocalJson = JSON.parse(oldLocal);
	renewLocalJson.splice(i, 1, newRow);

	cart = JSON.stringify(renewLocalJson);
	localStorage.setItem("cart", cart);
}

// search feature
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


//TapPay
TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox')
TPDirect.card.setup({
    fields: {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: '後三碼'
        }
    },
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.cvc': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
});

TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        // submitButton.removeAttribute('disabled')   >>>> 就是我的確認付款的按鈕
    } else {
        // Disable submit Button to get prime.
        // submitButton.setAttribute('disabled', true)
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.cvc === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.cvc === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
});


// call TPDirect.card.getPrime when user submit form to get tappay prime
// $('form').on('submit', onSubmit)
function onSubmit() {
	var goToPay = document.getElementById("goToPay");
	goToPay.addEventListener("click", function (event) {
		
		if ( confirmData() == true ) {
			event.preventDefault()

			// 取得 TapPay Fields 的 status
			const tappayStatus = TPDirect.card.getTappayFieldsStatus()

			// 確認是否可以 getPrime
			if (tappayStatus.canGetPrime === false) {
				alert('can not get prime')
				return
			}

			// Get prime
			TPDirect.card.getPrime((result) => {
			if (result.status !== 0) {
				alert('get prime error ' + result.msg)
				return
			}
		
		requestBody(result.card.prime)
		
		// alert('get prime 成功，prime: ' + result.card.prime)
		localStorage.removeItem("cart");
		checkQtyIcon();
		
	
	// send prime to your server, to pay with Pay by Prime API .
	// Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
		})
		}	
	}
)}


function confirmData() {
	const inputCell = document.getElementsByTagName("input")
	let a;
	for ( let i = 2; i < inputCell.length - 3 ; i++ ) {
		console.log(inputCell.length - 3)
	 	console.log(inputCell[i].value)
	 	if ( inputCell[i].value == "" ) {        
	  		alert("有資料還沒填完哦!")
	  		a = false;
	  		return a;
	 	} 
	}
   console.log(inputCell.length)
   
	for ( let i = 6; i < inputCell.length ; i++ ) {
		console.log(inputCell[i].checked)
	 	if ( inputCell[i].checked ) {
	  		a = true;
	  		return a;
	 	} else {
			if ( i == inputCell.length-1 ) {
			alert("有資料還沒填完哦!")
			a = false;
			return a;
		   }
	 	}
	}
}


let preferTime = "";
function getPreferTime(t) {
	preferTime = t;
}

function requestBody(p) {
	console.log(p)
	const testTexts = document.getElementsByClassName("textInput");
	const confirmPrice1 = document.getElementsByClassName("confirmPrice1");
	console.log(confirmPrice1[0].innerText)
	let price1 =  confirmPrice1[0].innerText.split("NT. ")[1];
	const confirmPrice2 = document.getElementsByClassName("confirmPrice2");
	let price2 =  confirmPrice2[0].innerText.split("NT. ")[1];
	const confirmPrice3 = document.getElementsByClassName("confirmPrice3");
	let price3 =  confirmPrice3[0].innerText.split("NT. ")[1];

	let list = cartJson;
	let order = {
		"prime": p,
		"order": {
			"shipping": "delivery",
			"payment": "credit_card",
			"subtotal": price1,
			"freight": price2,
			"total": price3,
			"recipient": {
				"name": testTexts[0].value,
				"phone": testTexts[1].value,
				"email": testTexts[2].value,
				"address": testTexts[3].value,
				"time": preferTime,
			}, 
			"list": list
		}
	}

	let checkoutData = [];
	checkoutData.push(order)
	console.log(checkoutData[0]);
	
	sendOrder(checkoutData[0]);

}

//FB access
let localFbData = localStorage.getItem("fb");
let accessDate = "Bearer " + localFbData;
console.log(accessDate)   //有get到

let orderNum = "";
const checkUrl = "https://api.appworks-school.tw/api/1.0/order/checkout";
function sendOrder(data) {
	isLoading();
	var ajax = new XMLHttpRequest();  
	ajax.open("POST", checkUrl, true);
	ajax.setRequestHeader("Content-Type", "application/json");
	ajax.setRequestHeader("Authorization", `${accessDate}`);
	ajax.onreadystatechange = function() {
		if (ajax.readyState === 4 && ajax.status === 200) {
			console.log("Hi~~~你進來了")
			console.log(ajax)
			console.log(JSON.parse(ajax.responseText))
			response = JSON.parse(ajax.responseText).data;
			console.log(response)
			console.log(response.number)
			orderNum = response.number
			goToThankyouPage();
		}
	};
	let stringData = JSON.stringify(data)
	ajax.send(stringData);
};

function goToThankyouPage() {
	location.href = `thankyou.html?${orderNum}`;
}

//loading畫面
// switch(document.readyState) {
//     case "loading":
      
//     container.style.display = 'none';
  

//     break;

//     case "interactive":
     
    
//     break;

//     case "complete":

//     break;
// }

function isLoading() {
	console.log("HI~~~")
	const mainCart = document.getElementById("mainCart")
	console.log(mainCart)
	mainCart.style.display = "none"
	const loading = document.getElementsByClassName("loading")
	loading[0].style.display = "block"
}
