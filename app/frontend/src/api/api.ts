const BACKEND_URI = "";

import { ChatAppResponse, ChatAppResponseOrError, ChatAppRequest, Config } from "./models";
import { useLogin, appServicesToken } from "../authConfig";

function getHeaders(idToken: string | undefined): Record<string, string> {
    var headers: Record<string, string> = {
        "Content-Type": "application/json"
    };
    // If using login and not using app services, add the id token of the logged in account as the authorization
    if (useLogin && appServicesToken == null) {
        if (idToken) {
            headers["Authorization"] = `Bearer ${idToken}`;
        }
    }

    return headers;
}

export async function askApi(request: ChatAppRequest, idToken: string | undefined): Promise<ChatAppResponse> {
    const response = await fetch(`${BACKEND_URI}/ask`, {
        method: "POST",
        headers: getHeaders(idToken),
        body: JSON.stringify(request)
    });

    const parsedResponse: ChatAppResponseOrError = await response.json();
    if (response.status > 299 || !response.ok) {
        throw Error(parsedResponse.error || "Unknown error");
    }

    return parsedResponse as ChatAppResponse;
}

export async function configApi(idToken: string | undefined): Promise<Config> {
    const response = await fetch(`${BACKEND_URI}/config`, {
        method: "GET",
        headers: getHeaders(idToken)
    });

    return (await response.json()) as Config;
}

export async function chatApi(request: ChatAppRequest, idToken: string | undefined): Promise<Response> {
    return await fetch(`${BACKEND_URI}/chat`, {
        method: "POST",
        headers: getHeaders(idToken),
        body: JSON.stringify(request)
    });
}

export async function invoiceApi(request: ChatAppRequest, idToken: string | undefined): Promise<Response> {
    return await fetch(`${BACKEND_URI}/invoice`, {
        method: "POST",
        headers: getHeaders(idToken),
        body: JSON.stringify(request)
    });
}

export function getCitationFilePath(citation: string): string {
    return `${BACKEND_URI}/content/${citation}`;
}
