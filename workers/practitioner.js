var axios = require("axios");
var conf = require("dotenv").config();
var practitioner = require("../models/practitioner");

module.exports = {

    processFetchPractitioners() {
        var countyCodes = Array.apply(0, Array(47)).map((element, index) => index + 1);
        for (var i = 0; i < countyCodes.length; i++) {
            this.processFetchPractitionersForCounty(countyCodes[i]);
        }
    },

    processFetchPractitionersForCounty(countyCode) {
        var query = "/getNASCOP/" + countyCode;
        var config = {
            url: query,
            method: "get",
            timeout: 1000 * 60 * 30, // 30 min
            baseURL: process.env.HRH_API_URL,
            headers: { "Content-Type": "application/json", "Authorization": process.env.HRH_API_KEY },
        }
        axios(config).then(function (response) {
            if (response.data && response.data.length) {
                response.data.forEach(row => {
                    if (
                        typeof row[0] !== "undefined" &&
                        typeof row[0]['PRACTITIONER_IDENTIFICATION'] !== "undefined" &&
                        typeof row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER_IDENTIFIERS'] !== "undefined"
                    ) {
                        var data = { practitionerUniqueId: null };
                        row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER_IDENTIFIERS'].forEach(identifiers => {
                            if (identifiers.ID && identifiers.IDENTIFIER_TYPE === 'PRACTITIONER_UNIQUE_ID') {
                                data.practitionerUniqueId = identifiers.ID;
                            } else if (identifiers.ID && identifiers.IDENTIFIER_TYPE === 'NATIONAL_ID') {
                                data.nationalId = identifiers.ID;
                            }
                        });
                        if (data.practitionerUniqueId) {
                            data.firstName = (typeof row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER NAMES'] !== "undefined" && typeof row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER NAMES']['FIRST_NAME'] !== "undefined" && row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER NAMES']['FIRST_NAME'].trim() !== "" ? row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER NAMES']['FIRST_NAME'] : null);
                            data.middleName = (typeof row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER NAMES'] !== "undefined" && typeof row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER NAMES']['MIDDLE_NAME'] !== "undefined" && row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER NAMES']['MIDDLE_NAME'].trim() !== "" ? row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER NAMES']['MIDDLE_NAME'] : null);
                            data.lastName = (typeof row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER NAMES'] !== "undefined" && typeof row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER NAMES']['LAST_NAME'] !== "undefined" && row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER NAMES']['LAST_NAME'].trim() !== "" ? row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER NAMES']['LAST_NAME'] : null);
                            data.dateOfBirth = (typeof row[0]['PRACTITIONER_IDENTIFICATION']['DATE_OF_BIRTH'] !== "undefined" && row[0]['PRACTITIONER_IDENTIFICATION']['DATE_OF_BIRTH'].trim() !== "" ? row[0]['PRACTITIONER_IDENTIFICATION']['DATE_OF_BIRTH'] : null);
                            data.dateOfBirthPrecision = (typeof row[0]['PRACTITIONER_IDENTIFICATION']['DATE_OF_BIRTH_PRECISION'] !== "undefined" && row[0]['PRACTITIONER_IDENTIFICATION']['DATE_OF_BIRTH_PRECISION'].trim() !== "" ? row[0]['PRACTITIONER_IDENTIFICATION']['DATE_OF_BIRTH_PRECISION'] : null);
                            data.sex = (typeof row[0]['PRACTITIONER_IDENTIFICATION']['SEX'] !== "undefined" && row[0]['PRACTITIONER_IDENTIFICATION']['SEX'].trim() !== "" ? row[0]['PRACTITIONER_IDENTIFICATION']['SEX'] : null);
                            data.postalAddress = (typeof row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER_ADDRESS'] !== "undefined" && typeof row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER_ADDRESS']['POSTAL_ADDRESS'] !== "undefined" && row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER_ADDRESS']['POSTAL_ADDRESS'].trim() !== "" ? row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER_ADDRESS']['POSTAL_ADDRESS'] : null);
                            data.phoneNumber = (typeof row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER_ADDRESS'] !== "undefined" && typeof row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER_ADDRESS']['PHONE_NUMBER'] !== "undefined" && row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER_ADDRESS']['PHONE_NUMBER'].trim() !== "" ? row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER_ADDRESS']['PHONE_NUMBER'] : null);
                            data.email = (typeof row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER_ADDRESS'] !== "undefined" && typeof row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER_ADDRESS']['EMAIL'] !== "undefined" && row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER_ADDRESS']['EMAIL'].trim() !== "" ? row[0]['PRACTITIONER_IDENTIFICATION']['PRACTITIONER_ADDRESS']['EMAIL'] : null);
                            data.qualification = (typeof row[0]['DEPLOYMENTS'] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0]['QUALIFICATION'] !== "undefined" && row[0]['DEPLOYMENTS'][0][0]['QUALIFICATION'].trim() !== "" ? row[0]['DEPLOYMENTS'][0][0]['QUALIFICATION'] : null);
                            data.deploymentDate = (typeof row[0]['DEPLOYMENTS'] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0]['DEPLOYMENT_DATE'] !== "undefined" && row[0]['DEPLOYMENTS'][0][0]['DEPLOYMENT_DATE'].trim() !== "" ? row[0]['DEPLOYMENTS'][0][0]['DEPLOYMENT_DATE'] : null);
                            data.employmentType = (typeof row[0]['DEPLOYMENTS'] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0]['EMPLOYMENT_TYPE'] !== "undefined" && row[0]['DEPLOYMENTS'][0][0]['EMPLOYMENT_TYPE'].trim() !== "" ? row[0]['DEPLOYMENTS'][0][0]['EMPLOYMENT_TYPE'] : null);
                            data.workStationType = (typeof row[0]['DEPLOYMENTS'] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0]['WORKSTATION_TYPE'] !== "undefined" && row[0]['DEPLOYMENTS'][0][0]['WORKSTATION_TYPE'].trim() !== "" ? row[0]['DEPLOYMENTS'][0][0]['WORKSTATION_TYPE'] : null);
                            data.mflCode = (typeof row[0]['DEPLOYMENTS'] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0]['MFL_CODE'] !== "undefined" && row[0]['DEPLOYMENTS'][0][0]['MFL_CODE'].trim() !== "" ? row[0]['DEPLOYMENTS'][0][0]['MFL_CODE'] : null);
                            data.workStation = (typeof row[0]['DEPLOYMENTS'] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0]['WORKSTATION'] !== "undefined" && row[0]['DEPLOYMENTS'][0][0]['WORKSTATION'].trim() !== "" ? row[0]['DEPLOYMENTS'][0][0]['WORKSTATION'] : null);
                            data.workStationArea = (typeof row[0]['DEPLOYMENTS'] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0]['WORKSTATION_AREA'] !== "undefined" && row[0]['DEPLOYMENTS'][0][0]['WORKSTATION_AREA'].trim() !== "" ? row[0]['DEPLOYMENTS'][0][0]['WORKSTATION_AREA'] : null);
                            data.workStationCounty = (typeof row[0]['DEPLOYMENTS'] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0]['WORKSTATION_COUNTY'] !== "undefined" && row[0]['DEPLOYMENTS'][0][0]['WORKSTATION_COUNTY'].trim() !== "" ? row[0]['DEPLOYMENTS'][0][0]['WORKSTATION_COUNTY'] : null);
                            data.deploymentEndDate = (typeof row[0]['DEPLOYMENTS'] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0] !== "undefined" && typeof row[0]['DEPLOYMENTS'][0][0]['DEPLOYMENT_END_DATE'] !== "undefined" && row[0]['DEPLOYMENTS'][0][0]['DEPLOYMENT_END_DATE'].trim() !== "" ? row[0]['DEPLOYMENTS'][0][0]['DEPLOYMENT_END_DATE'] : null);
                            practitioner.create(data);
                        }
                    }
                });
            }
        }).catch(function (error) {
            console.log("ProcessFetchPractitionersForCounty for " + countyCode + " failed at " + new Date() + " Reason: " + error.message);
        });
    }
}