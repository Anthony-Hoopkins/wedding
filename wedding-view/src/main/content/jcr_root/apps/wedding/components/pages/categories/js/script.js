var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.Categories = {};

    PORTAL.modules.Categories.selfSelector = "#categories-page-content";

    PORTAL.modules.Categories.init = function ($self) {

        (function () { // Работа с окнами входа и регистрации

            var entrance = document.getElementById("entrance-cabinet-btn-land");

            var registration = document.getElementById("registration-btn");
            var registration2 = document.querySelector(".btn-become-partner2");
            var registration3 = document.querySelector(".btn-become-partner");
            var entrance2 = document.querySelector(".have-account-entrance");
            var reg_futher = document.querySelector('#registration-futher');
            var reg_futher2 = document.querySelector('#registration-futher2');
            var reg_fin_user = document.querySelector('#registration-finish-user');
            var reg_fin_part = document.querySelector('#registration-finish-partner');

            var enter = document.getElementById("btn-entrance-form");

            entrance.addEventListener("click", function(evt) {
                console.log(evt.type);
                console.log(evt.clientX);
                this.style.color = "#555";
            });

            registration.addEventListener("click", function(evt) {
                this.style.color = "#555";
                console.log(evt.type);
            });

            var modal = document.querySelector("#entrance-form");

            function showForm(){
                /* Можно написать появление формы - а может и не писать */
                // На вход передается class
            }

            function showEntranceForm() {
                modal.style.visibility = "visible";
                let mwindow = document.querySelector(".window-entrance");
                mwindow.style.visibility = "visible";
                mwindow.style.left = (document.documentElement.clientWidth - mwindow.getBoundingClientRect().width)/2 + "px";
                mwindow.style.top = (document.documentElement.clientHeight - mwindow.getBoundingClientRect().height)/3 + "px";
            };

            function showRegistrationForm() {
                modal.style.visibility = "visible";
                let mwindow = document.querySelector(".window-registation");
                mwindow.style.visibility = "visible";
                mwindow.style.left = (document.documentElement.clientWidth - mwindow.getBoundingClientRect().width)/2 + "px";
                mwindow.style.top = (document.documentElement.clientHeight - mwindow.getBoundingClientRect().height)/3 + "px";
            };

            /* function hiddenModalWindow(){
                 let mwindow = document.querySelector(".window-registation");
             };*/

            var data_registration = {};

            entrance.addEventListener("click", showEntranceForm);
            entrance2.addEventListener("click", showEntranceForm);
            registration.addEventListener("click", showRegistrationForm);
            registration3.addEventListener("click", showRegistrationForm);
            registration2.addEventListener("click", showRegistrationForm);
            entrance2.addEventListener("click", function(){
                document.querySelector(".window-registation").style.visibility = "hidden";
            });

            enter.addEventListener("click", function(){
                document.querySelector(".window-entrance").style.visibility = "hidden";
                cabinet_login.style.display = "none";
                cabinet_success.style.display = "flex";
                modal.style.visibility = "hidden";
            });

            reg_futher.addEventListener("click", function(){
                document.querySelector(".window-registation").style.visibility = "hidden";
                let mwindow = document.querySelector(".window-registation-step2");
                mwindow.style.visibility = "visible";
                mwindow.style.left = (document.documentElement.clientWidth - mwindow.getBoundingClientRect().width)/2 + "px";
                mwindow.style.top = (document.documentElement.clientHeight - mwindow.getBoundingClientRect().height)/3 + "px";
            });

            reg_futher2.addEventListener("click", function(){
                document.querySelector(".window-registation-step2").style.visibility = "hidden";
                let mwindow = document.querySelector(".window-registation-step3-partner");
                mwindow.style.visibility = "visible";
                mwindow.style.left = (document.documentElement.clientWidth - mwindow.getBoundingClientRect().width)/2 + "px";
                mwindow.style.top = (document.documentElement.clientHeight - mwindow.getBoundingClientRect().height)/3 + "px";
            });

            var btn_finish =  document.querySelector("#registration-finish-partner");

            btn_finish.addEventListener("click", function(){
                document.querySelector(".window-registation-step3-partner").style.visibility = "hidden";
                cabinet_login.style.display = "none";
                cabinet_success.style.display = "flex";
                modal.style.visibility = "hidden";
            });

            window.addEventListener("resize", function(){
                if (modal.style.visibility == "visible"){
                    showEntranceForm();
                }
            });

            modal.addEventListener("click", function(evt) {
                if (evt.target == document.querySelector("#entrance-form")) {
                    this.style.visibility = "hidden";
                    Array.from(this.children).forEach(function(elem) {
                        elem.style.visibility = "hidden";
                    });
                };
            });

        }()); // end -  --- с окнами входа и регистрации


        (function () { // ============   Запросы

            var photo_first = $.ajax({
                url: "http://wedding-services.mycloud.by/services/rest.partners/photographers/minsk.15.json",
                type: "GET",
                dataType: "json",
                success: function (data) {
                    console.log("success");
                    console.dir(data);
                    console.dir(data[1]);
                    var e_ob = data;
                    e_ob[1]["phone"] = "change phone";
                    console.dir(e_ob);
                }
            });

            $.ajax({
                type: "GET",
                url: "http://wedding-services.mycloud.by/services/rest.catalog-categories/home/users/wedding/partners.json",
                dataType: 'json',
                success: function (data) {
                    console.log("success партнёров ");
                    console.dir(data);
                }
            });

            $.ajax({
                type: "GET",
                url: "http://wedding-services.mycloud.by/services/rest.tenders/gomel.json",
                dataType: 'json',
                success: function (data) {
                    console.log("success  тендеры города ");
                    console.dir(data);
                }
            });

            $.ajax({
                type: "GET",
                url: "http://wedding-services.mycloud.by/services/rest.users/minsk.json",
                dataType: 'json',
                success: function (data) {
                    console.log("success все юзеры ");
                    console.dir(data);
                }
            });

            $.ajax({
                type: "GET",
                url: "http://wedding-services.mycloud.by/services/rest.users/minsk.json?userId=2f97de50-d5f3-48b8-9fc5-e4b7f0e00918",
                dataType: 'json',
                success: function (data) {
                    console.log("success  Юзер конкретный ");
                    console.dir(data);
                }
            });

        }()); // end -  --- Запросы

        console.log('Component: "Categories"');

    };

    return PORTAL;

})(PORTAL || {}, jQuery);