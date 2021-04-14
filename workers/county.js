var axios = require("axios");
var conf = require("dotenv").config();
var county = require("../models/county");

module.exports = {

    processFetchPopulationByCounty() {
        var query = "/datasets/" + process.env.OPEN_DATA_POPULATION_BY_COUNTY_DATASET_ID + "/FeatureServer/0/query";
        var config = {
            url: query,
            method: "get",
            timeout: 1000 * 60 * 30, // 30 min
            baseURL: process.env.OPEN_DATA_API_URL,
            headers: { "Content-Type": "application/json" },
        }
        axios(config).then(function (response) {
            if (response.data && response.data.features && response.data.features.length) {
                response.data.features.forEach(row => {
                    if (
                        typeof row['attributes'] !== "undefined" &&
                        typeof row['attributes']['County'] !== "undefined" &&
                        typeof row['attributes']['Total'] !== "undefined"
                    ) {
                        var data = {
                            name: row['attributes']['County'],
                            population: row['attributes']['Total'],
                        };
                        county.create(data);
                    }
                });
            }
        }).catch(function (error) {
            console.log("ProcessFetchPopulationByCounty failed at " + new Date() + " Reason: " + error.message);
        });
    }
}