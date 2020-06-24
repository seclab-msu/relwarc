let Engine = {
    formsServiceUrl: "/ODVA/_vti_bin/OID.SharePoint.FormBuilder/forms.svc",
    endpointUrl: "/ODVA/_layouts/formbuilder/api/forms.ashx",
    formID: "83e3b0f2-1aea-4e88-a9f7-70c399316d2e",
    submitCallback: function (
        form,
        formState,
        fieldValues,
        reCaptchaResponse,
        files
    ) {
        oregon.analytics.sendEvent("Forms", "Submit", form.title());

        return fetch(
            "/ODVA/_vti_bin/OID.SharePoint.FormBuilder/submissions.svc/",
            {
                method: "POST",
                credentials: "include",
                headers: new Headers({
                    "content-type": "application/json",
                    "X-RequestDigest": oregon.sharePoint.context.requestDigest,
                }),
                body: JSON.stringify({
                    formId: "83e3b0f2-1aea-4e88-a9f7-70c399316d2e",
                    formState: formState,
                    fieldValues: fieldValues,
                    reCaptchaResponse: reCaptchaResponse,
                    files: files,
                }),
            }
        ).then(function (response) {
            if (!response.ok) throw response;
            return response;
        });
    },
};
