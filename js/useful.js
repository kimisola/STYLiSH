//facebook登入
window.fbAsyncInit = function(){
    FB.init({
        appId      : '2158461621116969',
        cookie     : true,
        xfbml      : true,
        version    : 'v5.0'
    });
};


function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log(response);
                   // The current login status of the person.
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
                      location.href = "profile.html"; 
                  });
              } 
          });

    } else {            // Not logged into your webpage or we are unable to tell.
        console.log("非登入狀態喔")
        FB.login(function(response) {
          if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me',
                       'GET',
                       {"fields":"id,name,email,picture{url}"},  function(response) {
                    console.log('Good to see you, ' + response.name + '.');
                    location.href = "profile.html"; 
                });
            } 
        },  {scope: 'email', return_scopes: true});
    }
}

function fb() {

    FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
        statusChangeCallback(response);  
        console.log(response);         // Returns the login status.
    });

    // FB.login(function(response) {    
    //     if (response.authResponse) {
    //       console.log('Welcome!  Fetching your information.... ');
    //       FB.api('/me', function(response) {
    //         console.log('Good to see you, ' + response.name + '.');
    //       });
    //     } else {
    //       console.log('User cancelled login or did not fully authorize.');
    //     }
    // }, {scope: 'public_profile,email'});
};


(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
} (document, 'script', 'facebook-jssdk'));   
//呼叫函式(document, 'script', 'facebook-jssdk') 最外面括號括起來 載入FB SDK(另一個js) >進入初始化套件函式


window.addEventListener("load", function() {
    memberLogin();
    cartItems();
});

function memberLogin() {
    const membericon = document.getElementById("membericon");
    const member_mobile = document.getElementById("member_mobile");
    const member_mobile_icon = document.getElementById("member_mobile_icon");
    membericon.addEventListener("click", () => {
        fb();
    });
    member_mobile.addEventListener("click", () => {
        fb();
    });
    member_mobile_icon.addEventListener("click", () => {
        fb();
    });
}


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
