package com.vodkamishkabalalaika.sling.restextension.api.processor;

import com.vodkamishkabalalaika.sling.restextension.Constants;
import com.vodkamishkabalalaika.sling.restextension.api.model.RestApiModel;
import com.vodkamishkabalalaika.sling.restextension.util.SlingModelUtil;
import org.apache.sling.api.SlingHttpServletRequest;

import java.util.Optional;

public interface RestProcessor {

    Object getObject(SlingHttpServletRequest request);

    Object updateObject(SlingHttpServletRequest request);

    Object createObject(SlingHttpServletRequest request);

    Object deleteObject(SlingHttpServletRequest request);

    default  <M extends RestApiModel> M createOrUpdateModel(SlingHttpServletRequest request, Class<M> modelClass) {
        final M model = request.adaptTo(modelClass);
        if (model == null) {
            return null;
        }
        SlingModelUtil.updateModel(model);
        return model;
    }

    default long getLimit(SlingHttpServletRequest request) {
        return Optional.ofNullable(request.getRequestPathInfo().getSuffix())
                .map(suffix -> suffix.substring(suffix.indexOf(Constants.DOT) + 1))
                .filter(suf -> suf.contains(Constants.DOT))
                .map(suffix -> suffix.substring(0, suffix.indexOf(Constants.DOT)))
                .map(Integer::parseInt)
                .orElse(Integer.MAX_VALUE);
    }
}
