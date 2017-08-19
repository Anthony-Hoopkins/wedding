package wedding.core.services.users;

import com.google.gson.JsonObject;
import wedding.core.services.users.beans.PortalUser;

import java.util.Date;

public interface PortalUserManager {

    boolean addPortalUser(String email, String pass);

    boolean updateSeller(String email, Date birthday, int age, String firstName, String lastName, String phoneNumber, String sex);

    boolean updateUser(String email, Date birthday, int age, String firstName, String lastName, String phoneNumber);

    boolean deleteUser(String email);

    boolean addNewSeller(String email, String pass);

    void addVerifyStatus(String email);

    boolean isVerify(String email);

    PortalUser getPortalUser(String email);

    boolean isUserExist(String userID, String authType);

    public JsonObject getPortalUserInfoAsJson(String email);

}
