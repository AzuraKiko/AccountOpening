
module.exports = {
    fields: {
        "customerReferenceNumber": { target: "equix_id", type: "string" },
        "applicant.entityType": {
            target: "account_type",
            type: "string",
            enumMap: { Individual: "INDIVIDUAL" },
        },
        "applicant.person.title": {
            target: "applicant_details[].title",
            type: "string",
            enumMap: { mr: "MR", mrs: "MRS", ms: "MS", miss: "MISS" },
        },

        "applicant.person.firstName": {
            target: "applicant_details[].first_name",
            type: "string",
        },
        "applicant.person.middleName": {
            target: "applicant_details[].middle_name",
            type: ["string", null],
        },
        "applicant.person.lastName": {
            target: "applicant_details[].last_name",
            type: "string",
        },
        "applicant.person.residentialAddress": {
            type: "object",
        },
        "applicant.person.residentialAddress.streetAddress": {
            target: [
                "applicant_details[].residential_address_address_line_1",
                "applicant_details[].residential_address_address_line_2"
            ],
            type: "string",
        },
        "applicant.person.residentialAddress.city": {
            target: "applicant_details[].residential_address_city_suburb",
            type: "string",
        },
        "applicant.person.residentialAddress.region": {
            type: "object",
        },
        "applicant.person.residentialAddress.region.code": {
            target: "applicant_details[].residential_address_state",
            type: "string",
        },
        "applicant.person.residentialAddress.postalCode": {
            target: "applicant_details[].residential_address_postcode",
            type: "string",
        },
        "applicant.person.residentialAddress.country": {
            type: "object",
        },
        "applicant.person.residentialAddress.country.code": {
            target: "applicant_details[].residential_address_country",
            type: "string",
            enumMap: { ANDORRA: "AD", AUSTRALIA: "AU", BAHRAIN: "BH" },
        },
        "applicant.person.postalAddress": {
            type: "object",
        },
        "applicant.person.postalAddress.streetAddress": {
            target: [
                "applicant_details[].postal_address_address_line_1",
                "applicant_details[].postal_address_address_line_2"
            ],
            type: "string",

        },
        "applicant.person.postalAddress.city": {
            target: "applicant_details[].postal_address_city_suburb",
            type: "string",
        },
        "applicant.person.postalAddress.region": {
            type: "object",
        },
        "applicant.person.postalAddress.region.code": {
            target: "applicant_details[].postal_address_state",
            type: "string",
        },
        "applicant.person.postalAddress.postalCode": {
            target: "applicant_details[].postal_address_postcode",
            type: "string",
        },
        "applicant.person.postalAddress.country": {
            type: "object",
        },
        "applicant.person.postalAddress.country.code": {
            target: "applicant_details[].postal_address_country",
            type: "string",
            enumMap: { ANDORRA: "AD", AUSTRALIA: "AU", BAHRAIN: "BH" },
        },
        "applicant.person.emailAddresses": {
            type: "array",
        },
        "applicant.person.emailAddresses[].type": {
            type: "string",
            defaultValue: "work",
        },
        "applicant.person.emailAddresses[].value": {
            target: "applicant_details[].applicant_email",
            type: "string",
        },
        "applicant.person.emailAddresses[].isPreferred": {
            type: "boolean",
            defaultValue: true,
        },
        "applicant.person.phoneNumbers": {
            type: "array",
        },
        "applicant.person.phoneNumbers[].type": {
            type: "string",
            defaultValue: "mobile",
        },
        "applicant.person.phoneNumbers[].value": {
            target: "applicant_details[].applicant_mobile_phone",
            type: "string",
        },
        "applicant.person.phoneNumbers.isPreferred": {
            type: "boolean",
            defaultValue: true,
        },
        "applicant.person.dateOfBirth": {
            target: "applicant_details[].dob",
            type: "string",
        },
        "applicant.person.gender": {
            target: "applicant_details[].gender",
            type: "string",
            enumMap: { mr: "MR", mrs: "MRS", ms: "MS", miss: "MISS" },
        },
        "applicant.person.nationalities": {
            type: "array",
        },
        "applicant.person.nationalities[].country": {
            target: "applicant_details[].nationality",
            type: "string",
            enumMap: { ANDORRA: "AD", AUSTRALIA: "AU", BAHRAIN: "BH" },
        },
        "applicant.person.nationalities[].type": {
            type: "string",
            defaultValue: "citizen",
        },
        "applicant.employment": {
            type: "object",
        },
        "applicant.employment.type": {
            target: "applicant_details[].occupation_type",
            type: "string",
        },
        "applicant.employment.category": {
            target: "applicant_details[].occupation_category",
            type: "string",
        },
        "applicant.taxDetails": {
            type: "array",
        },
        "applicant.taxDetails.country": {
            type: "string",
            defaultValue: "AU",
        },
        "applicant.taxDetails.isSupplied": {
            type: "boolean",
            defaultValue: false,
        },
        "applicant.taxDetails.taxIdentificationNumber": {
            type: ["string", null],
        },
        "applicant.taxDetails.nonSupplyReasonCode": {
            type: "string",
            defaultValue: "000000000",
        },
        "applicant.identityVerification": {
            type: "object",
        },
        "applicant.identityVerification.status": {
            type: "string",
            defaultValue: "verified",
        },
        "applicant.identityVerification.completionTimestamp": {
            target: "applicant_details[].uploaded_documents[].last_updated",
            type: "string",
        },
        "applicant.identityVerification.agentName": {
            type: ["string", null],
        },
        "applicant.screeningResults": {
            type: "object",
        },
        "applicant.screeningResults.status": {
            type: "string",
            defaultValue: "verified",
        },
        "applicant.screeningResults.completionTimestamp": {
            target: "applicant_details[].uploaded_documents[].last_updated",
            type: "string",
        },
        "applicant.screeningResults.agentName": {
            type: ["string", null],
        },
        tradingProduct: {
            type: "object",
        },
        "tradingProduct.type": {
            type: "string",
            defaultValue: "domestic-equities",
        },
        "tradingProduct.canTradeWarrants": {
            type: "boolean",
            defaultValue: true,
        },
        "tradingProduct.contractNote": {
            type: "object",
        },
        "tradingProduct.contractNote.type": {
            type: "string",
            defaultValue: "digital",
        },
        "tradingProduct.contractNote.generationType": {
            type: "string",
            defaultValue: "day",
        },
        settlement: {
            type: "object",
        },
        "settlement.details": {
            type: "array",
        },
        "settlement.details[].accountName": {
            target: "bank_account_name",
            type: "string",
        },
        "settlement.details[].branchCode": {
            target: "bank_bsb",
            type: "string",
        },
        "settlement.details[].accountNumber": {
            target: "bank_account_number",
            type: "string",
        },
        "settlement.details[].usedForCredits": {
            type: "boolean",
            defaultValue: true,
        },
        "settlement.details[].usedForDebits": {
            type: "boolean",
            defaultValue: true,
        },
        "settlement.details[].usedForDividends": {
            type: "boolean",
            defaultValue: true,
        },
        "settlement.details[].type": {
            type: "string",
            defaultValue: "direct-entry",
        },
        "settlement.nettingPolicy": {
            type: "string",
            defaultValue: "net",
        },
        "settlement.holdFunds": {
            type: ["boolean", null]
        },
        "settlement.redirectDividends": {
            type: ["boolean", null]
        },
        adviser: {
            type: ["object", null],
        },
        "adviser.code": {
            target: "advisor_code",
            type: ["string", null],
        },
        "adviser.brokerageCode": {
            type: ["string", null]
        },
        termsAndConditions: {
            type: "object",
        },
        "termsAndConditions.accepted": {
            type: "boolean",
            defaultValue: true,
        },
        "termsAndConditions.methodOfAcceptance": {
            type: "string",
            defaultValue: "digital",
        },
        "termsAndConditions.timestamp": {
            target: "submit_time",
            type: "string",
        },
        holdingDetails: {
            type: ["object", null],
        },
        "holdingDetails.hin": {
            target: "settlement_existing_hin",
            type: ["string", null],
        },
        "holdingDetails.pid": {
            target: "settlement_pid",
            type: ["string", null],
        },
        "holdingDetails.address": {
            type: ["object", null],
        },
        "holdingDetails.address.addressLines": {
            target: "holdingDetails_addressLines",
            type: ["array, null"],
        },
        "holdingDetails.address.postCode": {
            target: "applicant_details[].residential_address_postcode",
            type: ["string", null],
        },
        "holdingDetails.emailAddress": {
            target: "applicant_details[].applicant_email",
            type: ["string", null],
        },
    },
};