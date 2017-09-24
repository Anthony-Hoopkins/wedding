var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.LoginRegistration = {};

    PORTAL.modules.LoginRegistration.selfSelector = ".login-registration-block";

    var socialUser = {'id' : '', 'firstName' : '', 'lastName' : '', 'email' : '', 'phone' : '', 'nickname' : '', 'href' : '', "authType" : ""};
    var currentDate = new Date();
    var expires = new Date(currentDate.getTime() + 600000*60*60*3);
    var magnificPopup = $.magnificPopup.instance;
    var authorizationType;
    var userID;

    var $loginRegistrationLink;

    PORTAL.modules.LoginRegistration.AUTH = PORTAL.modules.LoginRegistration.AUTH || {};

    PORTAL.modules.LoginRegistration.AUTH.VK = {

        "login": function () {
            VK.Auth.login(function (response) {
                if (response.status === "connected") {
                    var responseUser = response.session.user;
                    socialUser.id = responseUser.hasOwnProperty("id") ? responseUser.id : "";
                    socialUser.firstName = responseUser.hasOwnProperty("first_name") ? responseUser.first_name : "";
                    socialUser.lastName = responseUser.hasOwnProperty("last_name") ? responseUser.last_name : "";
                    socialUser.nickname = responseUser.hasOwnProperty("nickname") ? responseUser.nickname : "";
                    socialUser.href = responseUser.hasOwnProperty("href") ? responseUser.href : "";
                    socialUser.authType = "VK";
                    checkIfUserExist(socialUser, authorizationType);
                    PORTAL.utils.set_cookie("authType", authorizationType, expires);
                    PORTAL.utils.set_cookie("authStatus", "authorized", expires);
                }
            }, VK.access.EMAIL);
        },

        "logout": function () {
            VK.Auth.logout(function (response) {

            });
        },
        "status": function () {
            VK.Auth.getLoginStatus(function (response) {
                if (response.status === "connected") {
                    authStatus = true;
                    socialUser.id = response.session.mid;
                    socialUser.authType = "VK";
                    drawUser();
                }
            });

        }

    };

    PORTAL.modules.LoginRegistration.init = function ($self) {
        console.log('Component: "LoginRegistration"');

        var authStatus = false;

        VK.init({
            apiId: 6153660
        });

        var authStatusFromCookie = PORTAL.utils.get_cookie("authStatus");
        var authType = PORTAL.utils.get_cookie("authType");

        if (authStatusFromCookie === "authorized" && authType) {
            PORTAL.modules.LoginRegistration.AUTH[authType].status();
        }

        var configForPopUp = {
            type: 'inline',
            closeBtnInside: true,
            midClick: true
        };

        var $firstStepSubmit = $self.find("#registration-firstStep");

        $(".user-logout-link").click(function(){
            PORTAL.modules.LoginRegistration.AUTH[authType].logout();
            $loginRegistrationLink.css("display","block");
            $(".user-menu-block").css("display","none");
        });

        $(".user-name-title").click(function(){
            var menu = $(".user-menu-block ul");
            console.log(menu.css("display"));
            if (menu.css("display") === 'none'){
                menu.css("display","flex");
            } else {
                menu.css("display","none");
            }
        });

        $self.find("#first-step-private").click(function(){
            $firstStepSubmit.attr("href","#registration-popup-second-step-private").css("display", "block");
            $self.find("#registration-private-firstName").val(socialUser.firstName);
            $self.find("#registration-private-lastName").val(socialUser.lastName);
        });

        $self.find("#first-step-partner").click(function(){
            $firstStepSubmit.attr("href","#registration-popup-second-step-partner").css("display", "block");
        });

        $loginRegistrationLink = $self.find("#login-registration-link");
        $loginRegistrationLink.magnificPopup(configForPopUp);

        $self.find("#registration-newAcc").magnificPopup(configForPopUp);

        $self.find("#registration-firstStep").magnificPopup(configForPopUp);

        var $loginPopUp = $self.find("#login-popup");

        $self.find("#vk-login-button").click(function () {
            authorizationType = "VK";
            PORTAL.modules.LoginRegistration.AUTH.VK.login();
        });

        $self.find(".registration-submit-partner").click(function(){
           var name = $("#registration-partner-name").val();
           var speciality = $("#registration-partner-speciality").find("option:selected").text();
           var city = $("#registration-partner-city").val();
           var email = $("#registration-partner-email").val();
           var phone = $("#registration-partner-phone").val();
           if (name && speciality && city && email && phone && email.match("^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z][a-z][a-z]|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$")){
               $.ajax({
                   url: "/services/registration",
                   type: "POST",
                   data: {
                       'type' : 'partner',
                       'userID' : socialUser.id,
                       'name': name,
                       'speciality': speciality,
                       'city' : city,
                       'authType' : authorizationType,
                       'email' : email,
                       'phone' : phone
                   },
                   success: function (data) {
                       if (data) {
                           alert(data);
                           magnificPopup.close();
                           drawUser();
                       }
                   }
               });
           } else {
               alert("Все поля должны быть заполнены. Поле Эл. Почта в формате example@domain.com");
           }
        });

        $self.find(".registration-submit-private").click(function(){
            var firstName = $("#registration-private-firstName").val();
            var lastName = $("#registration-private-lastName").val();
            var city = $("#registration-private-city").val();
            var email = $("#registration-private-email").val();
            if (firstName && lastName && city && email && email.match("^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z][a-z][a-z]|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$")){
                $.ajax({
                    url: "/services/registration",
                    type: "POST",
                    data: {
                        'type' : 'private',
                        'authType' : authorizationType,
                        'userID' : socialUser.id,
                        'firstName': firstName,
                        'lastName' : lastName,
                        'city' : city,
                        'email' : email
                    },
                    success: function (data) {
                        if (data) {
                            alert(data);
                            magnificPopup.close();
                            drawUser($self);
                        }
                    }
                });
            } else {
                alert("Все поля должны быть заполнены. Поле Эл. Почта в формате example@domain.com");
            }
        });

    };

    var checkIfUserExist = function (user, type) {
        $.ajax({
            type: "GET",
            url: "/services/checkuser",
            data: {
                "userID": user.id,
                "authType": type
            },
            success: function (isUserExist) {
                if (isUserExist === "true") {
                    drawUser();
                    magnificPopup.close();
                } else {
                    registerNewUser(user);
                }
            }
        });
    };

    var drawUser = function () {
        $.ajax({
            type: "GET",
            url: "/services/getuser",
            data: {
                "userID": socialUser.id,
                "authType": socialUser.authType
            },
            success: function (user) {
                if (user) {
                    $loginRegistrationLink.css("display","none");
                    var $userBlock = $(".user-menu-block");
                    $userBlock.css("display","flex");
                    var userName = "";
                    if (user.firstName){
                        userName = userName + user.firstName;
                    }
                    if (user.lastName){
                        userName = userName === "" ? user.lastName : userName + " " + user.lastName;
                    }
                    $userBlock.find(".user-name-title").text(userName);
                } else {

                }
            }
        });

    };

    var registerNewUser = function (user) {
        var userName;
        if (user.firstName || user.lastName){
            userName = user.firstName + " " + user.lastName;
        }
        if (!userName && user.nickname){
            userName = user.nickname;
        }
        if (!userName && user.href){
            userName = user.href;
        }
        if (userName){
            $("#registration-newAcc").css("display", "block").text("Создать аккаунт для " + userName);
        } else {
            $("#registration-newAcc").css("display", "block").text("Создать новый аккаун");
        }

    };

    return PORTAL;

})(PORTAL || {}, jQuery);