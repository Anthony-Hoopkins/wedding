package wedding.core.services.mail;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.util.Base64;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import wedding.core.utils.WeddingUtils;
import wedding.core.utils.ServerUtil;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Optional;


@Component(metatype = true, immediate = true)
@Service(WeddingMailService.class)
public class WeddingMailService {

    private static final Logger LOG = LoggerFactory.getLogger(WeddingMailService.class);

    private ComponentContext componentContext;

    @Property
    private static final String PATH_TO_REGISTRATION_MAIL = "path_to_registration_mail";

    @Property
    private static final String ADDRESS_FROM = "address_from";

    @Reference
    private WeddingUtils weddingUtils;

    @Reference
    private ServerUtil serverUtil;

    @Activate
    public void activate(ComponentContext componentContext) {
        this.componentContext = componentContext;
    }

    public boolean sendRegistrationMail(String userName) {
        ResourceResolver resolver = weddingUtils.getResolver();
        try {
            JackrabbitSession jackrabbitSession = Optional.of(resolver).
                    map(resourceResolver -> (JackrabbitSession) resourceResolver.adaptTo(Session.class)).orElse(null);
            Node registrationNode = jackrabbitSession.getNode(PropertiesUtil.toString(componentContext.getProperties().get(PATH_TO_REGISTRATION_MAIL), StringUtils.EMPTY) + "/jcr:content/par/text");
            if (registrationNode.hasProperty("text")) {
                HtmlEmail email = new HtmlEmail();
                email.setCharset("UTF-8");
                email.setSubject("Проверка адреса электронной почты");
                String html = registrationNode.getProperty("text").getString();
                String link = serverUtil.getDispatcherLink() + "/services/verifying.registration/" + Base64.encode(userName);
                LOG.info("SEND REGISTRATION EMAIL TO : " + userName);
                LOG.info("LINK TO VERIFICATION : " + link);
                String repairHtml = html.replace("${user}", userName).replace("${link}", link);
                Document document = Jsoup.parse(repairHtml);
                Elements images = document.getElementsByTag("img");
                for (Element element : images) {
                    String imgLink = element.attr("src");
                    element.attr("src", serverUtil.getDispatcherLink() + imgLink);
                }
                email.setHtmlMsg(document.outerHtml());
                email.setFrom(PropertiesUtil.toString(componentContext.getProperties().get(ADDRESS_FROM), StringUtils.EMPTY));
                email.addTo(userName);
            //    mailService.send(email);
                LOG.info("REGISTRATION LETTER SUCCESS SEND");
                return true;
            }

        } catch (RepositoryException | EmailException e) {
            LOG.error(e.getMessage());
        } finally {
            Optional.of(resolver).ifPresent(ResourceResolver::close);
        }
        return false;
    }

    public boolean sendNewsLetter(SlingHttpServletRequest request) {
        return true;
/*        NewsLetter newsLetter = NewsletterHelper.fromRequest(request, newsletterService);
        newsLetter.setFromAddress(new InternetAddress("administration@wedding-gomel.com"));
        newsLetter.setSubject("Письмо проверки пользователя");
        String email = request.getParameter("letterRecipient");
*//*        newsLetter.getMessageTemplate().put("user", email);
        newsLetter.getMessageTemplate().put("linkToVerification", request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/services/verifying.registration/" + email);*//*
        MailingList mailingList = newsletterService.createMailingList(email, request.getResourceResolver().adaptTo(Session.class));
        newsLetter.setMailingList(mailingList);
        MailingStatus mailingStatus = newsletterService.sendNewsletter(newsLetter);
        MailingStatusCode mailingStatusCode = mailingStatus.getStatusCode();
        return mailingStatusCode.equals(MailingStatusCode.SENT);*/

    }


}
