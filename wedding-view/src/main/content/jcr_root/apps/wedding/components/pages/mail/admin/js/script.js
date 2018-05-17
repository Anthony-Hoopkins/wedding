var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.AdminMail = {};

    PORTAL.modules.AdminMail.selfSelector = "#admin-mail-page-content";

    PORTAL.modules.AdminMail.init = function ($self) {

        console.log('Component: "AdminMail"');

        $self.find("input.new-mail-submit").click(function(){
            $.ajax({
                url: "/services/rest.mail/create.json",
                type: "POST",
                data: {
                    title : $self.find(".new-mail-title").val(),
                    resourceType : "wedding/components/pages/mail/base-mail",
                    path : "/mail/mails"
                }
            });
        });

    };

    return PORTAL;

})(PORTAL || {}, jQuery);