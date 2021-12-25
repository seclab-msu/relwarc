$IMA.Runner.onError = function (error) {
    fetch(
        "https://report.seznamzpravy.cz.test.js-training.seclab/report/custom",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                $type: "runner:error",
                message: error.message,
                stack: error.stack,
            }),
        }
    );
};

