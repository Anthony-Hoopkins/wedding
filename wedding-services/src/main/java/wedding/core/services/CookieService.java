package wedding.core.services;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingHttpServletResponse;

import javax.servlet.http.Cookie;

@Component(immediate = true, metatype = true)
@Service(CookieService.class)
public class CookieService {

    public boolean isCookieValid() {
        return false;
    }

    public static void addCookie(SlingHttpServletResponse response, String key, String value, int maxAge) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(maxAge);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

}
