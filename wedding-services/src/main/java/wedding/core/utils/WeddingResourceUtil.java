package wedding.core.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableList;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import wedding.core.model.ClientModel;

import javax.jcr.query.Query;
import java.io.IOException;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public final class WeddingResourceUtil {

    private static final Logger LOG = LoggerFactory.getLogger(WeddingResourceUtil.class);

    public static final String NT_WEDDING_RESOURCE = "wedding:resource";
    public static final String NT_WEDDING_RESOURCE_MIXIN = "mix:weddingResource";
    public static final String REQUEST_PARAMETER_WEDDING_RESOURCE_ID = "wedding:resourceId";
    public static final String REQUEST_PARAMETER_WEDDING_RESOURCE_TYPE = "wedding:resourceType";
    public static final String WEDDING_RESOURCE_TYPE_USER = "user";
    public static final String REQUEST_PARAMETER_ID = "id";
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final String RESOURCE_BY_ID_QUERY = "SELECT * FROM [wedding:resource] AS user WHERE user.[wedding:resourceId] = '%s'";
    private static final String PART_USER_QUERY = "AND resource.[wedding:resourceId] = '%s'";
    private static final List<String> ID_LIST = ImmutableList.of(REQUEST_PARAMETER_WEDDING_RESOURCE_ID, REQUEST_PARAMETER_ID);

    private WeddingResourceUtil() {
    }

    public static String getSuffixPathFromRequest(SlingHttpServletRequest request) {
        return Optional.ofNullable(request.getRequestPathInfo().getSuffix())
                .map(suffix -> suffix.substring(0, suffix.indexOf(wedding.core.data.Constants.DOT)))
                .orElse(StringUtils.EMPTY);
    }

    public static String getId(SlingHttpServletRequest request) {
        return ID_LIST.stream()
                .map(request::getParameter)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
    }

    public static String generateId() {
        return UUID.randomUUID().toString();
    }

    public static String getIdQueryPart(SlingHttpServletRequest request) {
        return Optional.ofNullable(getId(request))
                .map(user -> String.format(PART_USER_QUERY, user))
                .orElse(StringUtils.EMPTY);
    }

    public static <T> Stream<T> findModels(ResourceResolver resourceResolver, String query, Class<T> modelClass,
                                           int type, boolean parallel) {
        return iteratorToStream(resourceResolver.findResources(query, Query.SQL), type, parallel)
                .map(resource -> resource.adaptTo(modelClass));
    }

    public static <T> Stream<T> findModels(ResourceResolver resourceResolver, String query, Class<T> modelClass) {
        return findModels(resourceResolver, query, modelClass, Spliterator.ORDERED, false);
    }

    public static <T> Stream<T> iteratorToStream(Iterator<T> iterator, int type, boolean parallel) {
        Spliterator<T> spliterator = Spliterators.spliteratorUnknownSize(iterator, type);
        return StreamSupport.stream(spliterator, parallel);
    }

    public static <T> Stream<T> iteratorToOrderedStream(Iterator<T> iterator) {
        Spliterator<T> spliterator = Spliterators.spliteratorUnknownSize(iterator, Spliterator.ORDERED);
        return StreamSupport.stream(spliterator, false);
    }

    public static String toJson(Object object) {
        try {
            return MAPPER.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            LOG.error("Error occurred while processing [{}] object", object, e);
            // TODO: 10/9/2017 JSON object
            return "{}";
        }
    }

    public static <T> Optional<T> fromJson(String json, Class<T> modelClass) {
        try {
            return Optional.ofNullable(MAPPER.readValue(json, modelClass));
        } catch (IOException e) {
            LOG.error("Error occurred while processing json [{}] object", json, e);
            return Optional.empty();
        }
    }

    public static Optional<ClientModel> getUserData(ResourceResolver resourceResolver, String id) {
        return getUserResourcePath(resourceResolver, id)
                .map(resource -> resource.adaptTo(ClientModel.class));
    }

    public static Optional<Resource> getUserResourcePath(ResourceResolver resourceResolver, String id) {
        final String query = String.format(Constants.USER_QUERY, id);
        return iteratorToOrderedStream(resourceResolver.findResources(query, Query.SQL))
                .findFirst();
    }

    public static String getStringPropertyFromResource(Resource resource, String propertyName) {
        return Optional.of(resource)
                .map(Resource::getValueMap)
                .map(properties -> properties.get(propertyName, String.class))
                .orElse(StringUtils.EMPTY);
    }

    public static Function<String, Resource> getResourceByID(ResourceResolver resolver) {
        return id -> {
            final String query = String.format(RESOURCE_BY_ID_QUERY, id);
            Iterator<Resource> resourceIterator = resolver.findResources(query, Query.SQL);
            return resourceIterator.hasNext() ? resourceIterator.next() : null;
        };
    }

    public static boolean isResourceExist(SlingHttpServletRequest request) {
        return Optional.ofNullable(request.getParameter(REQUEST_PARAMETER_WEDDING_RESOURCE_ID))
                .map(getResourceByID(request.getResourceResolver()))
                .isPresent();

    }
}
