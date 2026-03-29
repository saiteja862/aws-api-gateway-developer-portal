/* eslint-disable */
/*
 * Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var apigClientFactory = {};

apigClientFactory.newClient = function (config) {
    var apigClient = {};

    if (config === undefined) {
        config = {};
    }

    config.accessKey = config.accessKey || '';
    config.secretKey = config.secretKey || '';
    config.sessionToken = config.sessionToken || '';
    config.region = config.region || 'YOUR_PRIMARY_AWS_REGION';
    config.apiKey = config.apiKey || '';
    config.defaultContentType = config.defaultContentType || 'application/json';
    config.defaultAcceptType = config.defaultAcceptType || 'application/json';

    // extract endpoint and path from url
    var invokeUrl = 'https://' + window.config.restApiId + '.execute-api.' + window.config.region + '.amazonaws.com/prod';
    var endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
    var pathComponent = invokeUrl.substring(endpoint.length);

    var sigV4ClientConfig = {
        accessKey: config.accessKey,
        secretKey: config.secretKey,
        sessionToken: config.sessionToken,
        serviceName: 'execute-api',
        region: config.region,
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var authType = 'NONE';
    if (
        sigV4ClientConfig.accessKey !== undefined &&
        sigV4ClientConfig.accessKey !== '' &&
        sigV4ClientConfig.secretKey !== undefined &&
        sigV4ClientConfig.secretKey !== ''
    ) {
        authType = 'AWS_IAM';
    }

    var simpleHttpClientConfig = {
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var apiGatewayClient = apiGateway.core.apiGatewayClientFactory.newClient(
        simpleHttpClientConfig,
        sigV4ClientConfig
    );

    apigClient.rootOptions = function (params, body, additionalParams) {
        if (additionalParams === undefined) {
            additionalParams = {};
        }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var rootOptionsRequest = {
            verb: 'OPTIONS',
            path: pathComponent + uritemplate('/').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };

        return apiGatewayClient.makeRequest(rootOptionsRequest, authType, additionalParams, config.apiKey);
    };

    apigClient.get = function (path, params, body, additionalParams) {
        if (additionalParams === undefined) {
            additionalParams = {};
        }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var getRequest = {
            verb: 'GET',
            path: pathComponent + path,
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['start', 'end', 'sdkType']),
            body: body
        };

        return apiGatewayClient.makeRequest(getRequest, authType, additionalParams, config.apiKey);
    };

    apigClient.post = function (path, params, body, additionalParams) {
        if (additionalParams === undefined) {
            additionalParams = {};
        }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var postRequest = {
            verb: 'POST',
            path: pathComponent + path,
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };

        return apiGatewayClient.makeRequest(postRequest, authType, additionalParams, config.apiKey);
    };

    apigClient.put = function (path, params, body, additionalParams) {
        if (additionalParams === undefined) {
            additionalParams = {};
        }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var putRequest = {
            verb: 'PUT',
            path: pathComponent + path,
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };

        return apiGatewayClient.makeRequest(putRequest, authType, additionalParams, config.apiKey);
    };

    apigClient.delete = function (path, params, body, additionalParams) {
        if (additionalParams === undefined) {
            additionalParams = {};
        }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var deleteRequest = {
            verb: 'DELETE',
            path: pathComponent + path,
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };

        return apiGatewayClient.makeRequest(deleteRequest, authType, additionalParams, config.apiKey);
    };

    return apigClient;
};